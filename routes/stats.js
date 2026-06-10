const Router = require('@koa/router');
const router = new Router({ prefix: '/stats' });
const pool = require('../db/index');

router.get('/week', async (ctx) => {
    const { date } = ctx.query;

    if (!date) {
        ctx.body = {
            code: 400,
            msg: 'date 参数不能为空'
        };
        return;
    }

    try {
        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            ctx.body = {
                code: 400,
                msg: 'date 格式错误，应为 yyyy-MM-dd'
            };
            return;
        }

        const dayOfWeek = targetDate.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startDate = new Date(targetDate);
        startDate.setDate(targetDate.getDate() - daysToMonday);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);


        const tasksSql = `
            SELECT t.id, t.task_name, t.repeat_type, t.week_rule, t.target_count
            FROM task t
            WHERE t.status = 1
        `;
        const [tasks] = await pool.query(tasksSql);

        const recordsSql = `
            SELECT r.task_id, r.record_date
            FROM record r
            JOIN task t ON r.task_id = t.id
            WHERE t.status = 1
              AND r.record_date >= ?
              AND r.record_date <= ?
        `;
        const [records] = await pool.query(recordsSql, [startDateStr, endDateStr]);

        const recordsMap = new Map();
        for (const record of records) {
            const taskId = record.task_id;
            const dateStr = formatDate(record.record_date);
            if (!recordsMap.has(taskId)) {
                recordsMap.set(taskId, new Set());
            }
            recordsMap.get(taskId).add(dateStr);
        }

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            weekDates.push(formatDate(d));
        }

        const result = tasks.map(task => {
            const checkedInDates = recordsMap.get(task.id) || new Set();
            const weekDays = weekDates.map(d => checkedInDates.has(d));

            return {
                task_id: task.id,
                task_name: task.task_name,
                repeat_type: task.repeat_type,
                week_rule: task.week_rule || '',
                target_count: task.target_count || 0,
                week_days: weekDays
            };
        });

        ctx.body = {
            code: 200,
            msg: 'success',
            data: result
        };

    } catch (err) {
        console.error('查询周统计失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/month', async (ctx) => {
    const { date } = ctx.query;

    if (!date) {
        ctx.body = {
            code: 400,
            msg: 'date 参数不能为空'
        };
        return;
    }

    try {
        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            ctx.body = {
                code: 400,
                msg: 'date 格式错误，应为 yyyy-MM-dd'
            };
            return;
        }

        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();

        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);

        const tasksSql = `
            SELECT t.id, t.task_name, t.repeat_type, t.week_rule, t.create_time
            FROM task t
            WHERE t.status = 1
        `;
        const [tasks] = await pool.query(tasksSql);

        const recordsSql = `
            SELECT r.task_id, r.record_date
            FROM record r
            JOIN task t ON r.task_id = t.id
            WHERE t.status = 1
              AND r.record_date >= ?
              AND r.record_date <= ?
        `;
        const [records] = await pool.query(recordsSql, [startDateStr, endDateStr]);

        const recordsMap = new Map();
        for (const record of records) {
            const taskId = record.task_id;
            const day = record.record_date.getDate();
            if (!recordsMap.has(taskId)) {
                recordsMap.set(taskId, new Set());
            }
            recordsMap.get(taskId).add(day);
        }

        const result = tasks.map(task => {
            const checkedInDays = recordsMap.get(task.id) || new Set();
            const monthDays = Array.from(checkedInDays).sort((a, b) => a - b);

            return {
                task_id: task.id,
                task_name: task.task_name,
                repeat_type: task.repeat_type,
                week_rule: task.week_rule || '',
                create_time: task.create_time ? formatDate(task.create_time) : null,
                month_days: monthDays
            };
        });

        ctx.body = {
            code: 200,
            msg: 'success',
            data: result
        };

    } catch (err) {
        console.error('查询月统计失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/year', async (ctx) => {
    const { year } = ctx.query;

    if (!year) {
        ctx.body = {
            code: 400,
            msg: 'year 参数不能为空'
        };
        return;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
        ctx.body = {
            code: 400,
            msg: 'year 参数格式错误'
        };
        return;
    }

    try {
        const startDateStr = `${yearNum}-01-01`;
        const endDateStr = `${yearNum}-12-31`;

        const tasksSql = `
            SELECT t.id, t.task_name
            FROM task t
            WHERE t.status = 1
        `;
        const [tasks] = await pool.query(tasksSql);

        const recordsSql = `
            SELECT r.task_id, r.record_date
            FROM record r
            JOIN task t ON r.task_id = t.id
            WHERE t.status = 1
              AND r.record_date >= ?
              AND r.record_date <= ?
        `;
        const [records] = await pool.query(recordsSql, [startDateStr, endDateStr]);

        const recordsMap = new Map();
        for (const record of records) {
            const taskId = record.task_id;
            const month = record.record_date.getMonth() + 1;
            const day = record.record_date.getDate();

            if (!recordsMap.has(taskId)) {
                recordsMap.set(taskId, new Map());
            }
            const monthMap = recordsMap.get(taskId);
            if (!monthMap.has(month)) {
                monthMap.set(month, new Set());
            }
            monthMap.get(month).add(day);
        }

        const result = tasks.map(task => {
            const monthMap = recordsMap.get(task.id) || new Map();
            const months = [];
            let totalDays = 0;

            for (let m = 1; m <= 12; m++) {
                const days = monthMap.get(m) || new Set();
                if (days.size > 0) {
                    months.push({
                        month: m,
                        days: Array.from(days).sort((a, b) => a - b)
                    });
                    totalDays += days.size;
                }
            }

            return {
                task_id: task.id,
                task_name: task.task_name,
                total_days: totalDays,
                months: months
            };
        });

        ctx.body = {
            code: 200,
            msg: 'success',
            data: result
        };

    } catch (err) {
        console.error('查询年统计失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/rate/:taskId', async (ctx) => {
    const { taskId } = ctx.params;

    if (!taskId) {
        ctx.body = {
            code: 400,
            msg: 'taskId 参数不能为空'
        };
        return;
    }

    try {
        const checkTaskSql = `SELECT * FROM task WHERE id = ?`;
        const [tasks] = await pool.query(checkTaskSql, [taskId]);

        if (tasks.length === 0) {
            ctx.body = {
                code: 404,
                msg: '任务不存在'
            };
            return;
        }

        const totalCountSql = `
            SELECT COUNT(*) as count 
            FROM record 
            WHERE task_id = ?
        `;
        const [totalCountResult] = await pool.query(totalCountSql, [taskId]);
        const totalCount = totalCountResult[0].count;

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const monthStart = formatDate(new Date(year, month, 1));
        const monthEnd = formatDate(new Date(year, month + 1, 0));

        const monthCountSql = `
            SELECT COUNT(*) as count 
            FROM record 
            WHERE task_id = ? AND record_date >= ? AND record_date <= ?
        `;
        const [monthCountResult] = await pool.query(monthCountSql, [taskId, monthStart, monthEnd]);
        const monthCount = monthCountResult[0].count;

        const task = tasks[0];
        let maxStreak = task.max_streak || 0;

        if (maxStreak === 0) {
            const allRecordsSql = `
                SELECT record_date 
                FROM record 
                WHERE task_id = ?
                ORDER BY record_date ASC
            `;
            const [allRecords] = await pool.query(allRecordsSql, [taskId]);
            
            if (allRecords.length > 0) {
                const dates = allRecords.map(r => new Date(formatDate(r.record_date)));
                const sortedDates = [...dates].sort((a, b) => a - b);
                
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
                maxStreak = Math.max(maxStreak, tempStreak);
                
                const updateTaskSql = `UPDATE task SET max_streak = ? WHERE id = ?`;
                await pool.query(updateTaskSql, [maxStreak, taskId]);
            }
        }

        ctx.body = {
            code: 200,
            msg: 'success',
            data: {
                total_count: totalCount,
                month_count: monthCount,
                max_streak: maxStreak
            }
        };

    } catch (err) {
        console.error('查询任务统计失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = router;
