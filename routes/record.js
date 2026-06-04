const Router = require('@koa/router');
const router = new Router({ prefix: '/record' });
const pool = require('../db/index');

router.post('/checkin', async (ctx) => {
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

        const targetDate = new Date(record_date);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (targetDate - firstDayOfYear) / 86400000;
        const weekOfYear = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

        const upsertWeekCountSql = `
            INSERT INTO task_count (task_id, year, month, week, total_count)
            VALUES (?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE total_count = total_count + 1
        `;
        await connection.query(upsertWeekCountSql, [task_id, year, month, weekOfYear]);

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
