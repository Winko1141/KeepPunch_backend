const Router = require('@koa/router');
const router = new Router({ prefix: '/record' });
const pool = require('../db/index');

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function calculateMaxStreak(dates) {
    if (dates.length === 0) return 0;
    
    const sortedDates = [...dates].sort((a, b) => a - b);
    let maxStreak = 1;
    let tempStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
        const diff = Math.floor((sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
            tempStreak++;
        } else {
            maxStreak = Math.max(maxStreak, tempStreak);
            tempStreak = 1;
        }
    }
    return Math.max(maxStreak, tempStreak);
}

router.post('/checkin', async (ctx) => {
    const { task_id, record_date } = ctx.request.body;

    if (!task_id || !record_date) {
        ctx.body = {
            code: 400,
            msg: 'task_id 和 record_date 不能为空'
        };
        return;
    }

    const targetDate = new Date(record_date);
    if (isNaN(targetDate.getTime())) {
        ctx.body = {
            code: 400,
            msg: 'record_date 格式错误，应为 yyyy-MM-dd'
        };
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate > today) {
        ctx.body = {
            code: 400,
            msg: '不能打卡未来日期'
        };
        return;
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const checkSql = `SELECT * FROM record WHERE task_id = ? AND record_date = ?`;
        const [existing] = await connection.query(checkSql, [task_id, record_date]);

        if (existing.length > 0) {
            await connection.rollback();
            ctx.body = {
                code: 400,
                msg: '今天已打卡'
            };
            return;
        }

        const insertSql = `
            INSERT INTO record (task_id, record_date, is_finish)
            VALUES (?, ?, 1)
        `;
        const [result] = await connection.query(insertSql, [task_id, record_date]);

        const targetDate2 = new Date(record_date);
        const year = targetDate2.getFullYear();
        const month = targetDate2.getMonth() + 1;
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (targetDate2 - firstDayOfYear) / 86400000;
        const weekOfYear = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

        const upsertWeekCountSql = `
            INSERT INTO task_count (task_id, year, month, week, total_count)
            VALUES (?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE total_count = total_count + 1
        `;
        await connection.query(upsertWeekCountSql, [task_id, year, month, weekOfYear]);

        const allRecordsSql = `
            SELECT record_date 
            FROM record 
            WHERE task_id = ?
            ORDER BY record_date ASC
        `;
        const [allRecords] = await connection.query(allRecordsSql, [task_id]);
        const dates = allRecords.map(r => new Date(formatDate(r.record_date)));
        const newMaxStreak = calculateMaxStreak(dates);

        const taskSql = `SELECT max_streak FROM task WHERE id = ?`;
        const [taskResult] = await connection.query(taskSql, [task_id]);
        const currentMaxStreak = taskResult[0]?.max_streak || 0;

        if (newMaxStreak > currentMaxStreak) {
            const updateTaskSql = `UPDATE task SET max_streak = ? WHERE id = ?`;
            await connection.query(updateTaskSql, [newMaxStreak, task_id]);
        }

        await connection.commit();

        ctx.body = {
            code: 200,
            msg: '打卡成功',
            data: { id: result.insertId }
        };

    } catch (err) {
        await connection.rollback();
        console.error('打卡失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    } finally {
        connection.release();
    }
});

router.delete('/checkin', async (ctx) => {
    const { task_id, record_date } = ctx.request.body;

    if (!task_id || !record_date) {
        ctx.body = {
            code: 400,
            msg: 'task_id 和 record_date 不能为空'
        };
        return;
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const checkSql = `SELECT * FROM record WHERE task_id = ? AND record_date = ?`;
        const [existing] = await connection.query(checkSql, [task_id, record_date]);

        if (existing.length === 0) {
            await connection.rollback();
            ctx.body = {
                code: 404,
                msg: '该日期没有打卡记录'
            };
            return;
        }

        const deleteSql = `DELETE FROM record WHERE task_id = ? AND record_date = ?`;
        await connection.query(deleteSql, [task_id, record_date]);

        const targetDate = new Date(record_date);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (targetDate - firstDayOfYear) / 86400000;
        const weekOfYear = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

        const updateCountSql = `
            UPDATE task_count 
            SET total_count = GREATEST(total_count - 1, 0)
            WHERE task_id = ? AND year = ? AND month = ? AND week = ?
        `;
        await connection.query(updateCountSql, [task_id, year, month, weekOfYear]);

        const allRecordsSql = `
            SELECT record_date 
            FROM record 
            WHERE task_id = ?
            ORDER BY record_date ASC
        `;
        const [allRecords] = await connection.query(allRecordsSql, [task_id]);
        const dates = allRecords.map(r => new Date(formatDate(r.record_date)));
        const newMaxStreak = calculateMaxStreak(dates);

        const updateTaskSql = `UPDATE task SET max_streak = ? WHERE id = ?`;
        await connection.query(updateTaskSql, [newMaxStreak, task_id]);

        await connection.commit();

        ctx.body = {
            code: 200,
            msg: '取消打卡成功'
        };

    } catch (err) {
        await connection.rollback();
        console.error('取消打卡失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    } finally {
        connection.release();
    }
});

router.get('/date/:date', async (ctx) => {
    const { date } = ctx.params;

    try {
        const sql = `
            SELECT r.*, t.task_name, t.icon
            FROM record r
            JOIN task t ON r.task_id = t.id
            WHERE r.record_date = ?
        `;
        const [records] = await pool.query(sql, [date]);

        const result = records.map(record => ({
            id: record.id,
            task_id: record.task_id,
            task_name: record.task_name,
            icon: record.icon,
            record_date: record.record_date,
            is_finish: record.is_finish,
            create_time: record.create_time ? record.create_time.toISOString().slice(0, 19).replace('T', ' ') : null
        }));

        ctx.body = {
            code: 200,
            msg: 'success',
            data: result
        };

    } catch (err) {
        console.error('查询打卡记录失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

module.exports = router;
