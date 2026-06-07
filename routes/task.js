const Router = require('@koa/router');
const router = new Router({ prefix: '/task' });
const pool = require('../db/index');

router.post('/create', async (ctx) => {
    const {
        task_name,
        icon,
        repeat_type,
        week_rule,
        target_count,
        reminder_time,
        reminder_enabled,
        category_id
    } = ctx.request.body;

    if (!task_name || !repeat_type) {
        ctx.body = {
            code: 400,
            msg: 'task_name 和 repeat_type 不能为空'
        };
        return;
    }

    const sql = `
        INSERT INTO task
        (task_name, icon, repeat_type, week_rule, target_count, status, reminder_time, reminder_enabled, category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const result = await pool.query(sql, [
            task_name,
            icon || 'book',
            repeat_type,
            week_rule || '',
            target_count || 0,
            1,
            reminder_time || null,
            reminder_enabled ? 1 : 0,
            category_id || null
        ]);

        ctx.body = {
            code: 200,
            msg: '创建成功',
            data: { id: result[0].insertId }
        };

    } catch (err) {
        console.error('创建任务失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/list', async (ctx) => {
    const { date, category_id } = ctx.query;

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
        const normalizedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (targetDate - firstDayOfYear) / 86400000;
        const weekOfYear = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

        let tasksSql = `
            SELECT t.*, 
                   c.id as category_id, c.name as category_name, c.icon as category_icon, c.color as category_color,
                   CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as is_finished
            FROM task t
            LEFT JOIN record r ON t.id = r.task_id AND r.record_date = ?
            LEFT JOIN category c ON t.category_id = c.id
            WHERE t.status = 1
        `;
        const sqlParams = [date];

        if (category_id) {
            if (category_id === '0') {
                tasksSql += ' AND t.category_id IS NULL';
            } else {
                tasksSql += ' AND t.category_id = ?';
                sqlParams.push(category_id);
            }
        }

        const [tasks] = await pool.query(tasksSql, sqlParams);

        const filteredTasks = tasks.filter(task => {
            if (task.repeat_type === 1) {
                if (!task.week_rule) return true;
                const weekRules = task.week_rule.split(',').map(Number);
                return weekRules.includes(normalizedDayOfWeek);
            }
            return true;
        });

        const result = [];
        for (const task of filteredTasks) {
            if (task.repeat_type === 2 && task.target_count > 0) {
                const weekCountSql = `
                    SELECT COUNT(*) as count 
                    FROM record 
                    WHERE task_id = ? 
                      AND YEAR(record_date) = ? 
                      AND WEEK(record_date, 1) = ?
                `;
                const [weekCountResult] = await pool.query(weekCountSql, [task.id, year, weekOfYear - 1]);
                const weekCount = weekCountResult[0].count;
                if (weekCount >= task.target_count) {
                    continue;
                }
            }

            if (task.repeat_type === 3 && task.target_count > 0) {
                const monthCountSql = `
                    SELECT COUNT(*) as count 
                    FROM record 
                    WHERE task_id = ? 
                      AND YEAR(record_date) = ? 
                      AND MONTH(record_date) = ?
                `;
                const [monthCountResult] = await pool.query(monthCountSql, [task.id, year, month]);
                const monthCount = monthCountResult[0].count;
                if (monthCount >= task.target_count) {
                    continue;
                }
            }

            result.push({
                id: task.id,
                task_name: task.task_name,
                icon: task.icon,
                repeat_type: task.repeat_type,
                week_rule: task.week_rule,
                target_count: task.target_count,
                status: task.status,
                is_finished: task.is_finished === 1,
                create_time: task.create_time ? task.create_time.toISOString().slice(0, 19).replace('T', ' ') : null,
                reminder_time: task.reminder_time,
                reminder_enabled: task.reminder_enabled === 1,
                category_id: task.category_id,
                category_name: task.category_name,
                category_icon: task.category_icon,
                category_color: task.category_color
            });
        }

        ctx.body = {
            code: 200,
            msg: 'success',
            data: result
        };

    } catch (err) {
        console.error('查询任务列表失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/all', async (ctx) => {
    const { category_id } = ctx.query;

    try {
        let tasksSql = `
            SELECT t.*, 
                   c.id as category_id, c.name as category_name, c.icon as category_icon, c.color as category_color
            FROM task t
            LEFT JOIN category c ON t.category_id = c.id
            WHERE 1=1
        `;
        const sqlParams = [];

        if (category_id) {
            if (category_id === '0') {
                tasksSql += ' AND t.category_id IS NULL';
            } else {
                tasksSql += ' AND t.category_id = ?';
                sqlParams.push(category_id);
            }
        }

        tasksSql += ' ORDER BY t.status ASC, t.create_time DESC';

        const [tasks] = await pool.query(tasksSql, sqlParams);

        const result = tasks.map(task => ({
            id: task.id,
            task_name: task.task_name,
            icon: task.icon,
            repeat_type: task.repeat_type,
            week_rule: task.week_rule,
            target_count: task.target_count,
            status: task.status,
            is_finished: false,
            create_time: task.create_time ? task.create_time.toISOString().slice(0, 19).replace('T', ' ') : null,
            reminder_time: task.reminder_time,
            reminder_enabled: task.reminder_enabled === 1,
            category_id: task.category_id,
            category_name: task.category_name,
            category_icon: task.category_icon,
            category_color: task.category_color
        }));

        ctx.body = {
            code: 200,
            msg: 'success',
            data: result
        };

    } catch (err) {
        console.error('查询所有任务失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/:id', async (ctx) => {
    const taskId = ctx.params.id;

    try {
        const sql = `
            SELECT t.*, 
                   c.id as category_id, c.name as category_name, c.icon as category_icon, c.color as category_color
            FROM task t
            LEFT JOIN category c ON t.category_id = c.id
            WHERE t.id = ?
        `;
        const [tasks] = await pool.query(sql, [taskId]);

        if (tasks.length === 0) {
            ctx.body = {
                code: 404,
                msg: '任务不存在'
            };
            return;
        }

        const task = tasks[0];
        ctx.body = {
            code: 200,
            msg: 'success',
            data: {
                id: task.id,
                task_name: task.task_name,
                icon: task.icon,
                repeat_type: task.repeat_type,
                week_rule: task.week_rule,
                target_count: task.target_count,
                status: task.status,
                create_time: task.create_time ? task.create_time.toISOString().slice(0, 19).replace('T', ' ') : null,
                reminder_time: task.reminder_time,
                reminder_enabled: task.reminder_enabled === 1,
                category_id: task.category_id,
                category_name: task.category_name,
                category_icon: task.category_icon,
                category_color: task.category_color
            }
        };

    } catch (err) {
        console.error('查询任务详情失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.put('/:id', async (ctx) => {
    const taskId = ctx.params.id;
    const { task_name, icon, repeat_type, week_rule, target_count, reminder_time, reminder_enabled, category_id } = ctx.request.body;

    try {
        const checkSql = `SELECT * FROM task WHERE id = ?`;
        const [tasks] = await pool.query(checkSql, [taskId]);

        if (tasks.length === 0) {
            ctx.body = {
                code: 404,
                msg: '任务不存在'
            };
            return;
        }

        const currentTask = tasks[0];

        const updateSql = `
            UPDATE task 
            SET task_name = ?, icon = ?, repeat_type = ?, week_rule = ?, target_count = ?,
                reminder_time = ?, reminder_enabled = ?, category_id = ?
            WHERE id = ?
        `;

        const newReminderEnabled = reminder_enabled !== undefined ? (reminder_enabled ? 1 : 0) : currentTask.reminder_enabled;
        const newCategoryId = category_id !== undefined ? (category_id === 0 ? null : category_id) : currentTask.category_id;

        await pool.query(updateSql, [
            task_name || currentTask.task_name,
            icon || currentTask.icon,
            repeat_type || currentTask.repeat_type,
            week_rule !== undefined ? week_rule : currentTask.week_rule,
            target_count !== undefined ? target_count : currentTask.target_count,
            reminder_time !== undefined ? reminder_time : currentTask.reminder_time,
            newReminderEnabled,
            newCategoryId,
            taskId
        ]);

        ctx.body = {
            code: 200,
            msg: '更新成功'
        };

    } catch (err) {
        console.error('更新任务失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.delete('/:id', async (ctx) => {
    const taskId = ctx.params.id;

    try {
        const checkSql = `SELECT * FROM task WHERE id = ?`;
        const [tasks] = await pool.query(checkSql, [taskId]);

        if (tasks.length === 0) {
            ctx.body = {
                code: 404,
                msg: '任务不存在'
            };
            return;
        }

        const updateSql = `UPDATE task SET status = 2 WHERE id = ?`;
        await pool.query(updateSql, [taskId]);

        ctx.body = {
            code: 200,
            msg: '任务已终止'
        };

    } catch (err) {
        console.error('终止任务失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.post('/:id/restore', async (ctx) => {
    const taskId = ctx.params.id;

    try {
        const checkSql = `SELECT * FROM task WHERE id = ?`;
        const [tasks] = await pool.query(checkSql, [taskId]);

        if (tasks.length === 0) {
            ctx.body = {
                code: 404,
                msg: '任务不存在'
            };
            return;
        }

        const task = tasks[0];
        if (task.status !== 2) {
            ctx.body = {
                code: 400,
                msg: '任务未处于终止状态'
            };
            return;
        }

        const updateSql = `UPDATE task SET status = 1 WHERE id = ?`;
        await pool.query(updateSql, [taskId]);

        ctx.body = {
            code: 200,
            msg: '任务已恢复'
        };

    } catch (err) {
        console.error('恢复任务失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

module.exports = router;
