const Router = require('@koa/router');
const router = new Router({ prefix: '/icon' });
const pool = require('../db/index');

router.get('/list', async (ctx) => {
    try {
        const systemSql = `
            SELECT id, name, display_name, icon_type, icon_content, icon_format, sort_order, is_active,
                   DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') as create_time,
                   DATE_FORMAT(update_time, '%Y-%m-%d %H:%i:%s') as update_time
            FROM icon
            WHERE icon_type = 'system' AND is_active = 1
            ORDER BY sort_order ASC, id ASC
        `;
        const customSql = `
            SELECT id, name, display_name, icon_type, icon_content, icon_format, sort_order, is_active,
                   DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') as create_time,
                   DATE_FORMAT(update_time, '%Y-%m-%d %H:%i:%s') as update_time
            FROM icon
            WHERE icon_type = 'custom' AND is_active = 1
            ORDER BY sort_order ASC, id DESC
        `;

        const [systemIcons] = await pool.query(systemSql);
        const [customIcons] = await pool.query(customSql);

        ctx.body = {
            code: 200,
            msg: 'success',
            data: {
                system: systemIcons,
                custom: customIcons
            }
        };

    } catch (err) {
        console.error('查询图标列表失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/system', async (ctx) => {
    try {
        const sql = `
            SELECT id, name, display_name, icon_type, icon_content, icon_format, sort_order, is_active,
                   DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') as create_time,
                   DATE_FORMAT(update_time, '%Y-%m-%d %H:%i:%s') as update_time
            FROM icon
            WHERE icon_type = 'system' AND is_active = 1
            ORDER BY sort_order ASC, id ASC
        `;
        const [icons] = await pool.query(sql);

        ctx.body = {
            code: 200,
            msg: 'success',
            data: icons
        };

    } catch (err) {
        console.error('查询系统图标列表失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/custom', async (ctx) => {
    try {
        const sql = `
            SELECT id, name, display_name, icon_type, icon_content, icon_format, sort_order, is_active,
                   DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') as create_time,
                   DATE_FORMAT(update_time, '%Y-%m-%d %H:%i:%s') as update_time
            FROM icon
            WHERE icon_type = 'custom' AND is_active = 1
            ORDER BY sort_order ASC, id DESC
        `;
        const [icons] = await pool.query(sql);

        ctx.body = {
            code: 200,
            msg: 'success',
            data: icons
        };

    } catch (err) {
        console.error('查询自定义图标列表失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.get('/:id', async (ctx) => {
    const iconId = ctx.params.id;

    try {
        const sql = `
            SELECT id, name, display_name, icon_type, icon_content, icon_format, sort_order, is_active,
                   DATE_FORMAT(create_time, '%Y-%m-%d %H:%i:%s') as create_time,
                   DATE_FORMAT(update_time, '%Y-%m-%d %H:%i:%s') as update_time
            FROM icon
            WHERE id = ?
        `;
        const [icons] = await pool.query(sql, [iconId]);

        if (icons.length === 0) {
            ctx.body = {
                code: 404,
                msg: '图标不存在'
            };
            return;
        }

        ctx.body = {
            code: 200,
            msg: 'success',
            data: icons[0]
        };

    } catch (err) {
        console.error('查询图标详情失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.post('/create', async (ctx) => {
    const { display_name, icon_content, icon_format, sort_order } = ctx.request.body;

    if (!icon_content) {
        ctx.body = {
            code: 400,
            msg: '图标内容不能为空'
        };
        return;
    }

    try {
        const timestamp = Date.now();
        const name = `custom_${timestamp}`;

        const sql = `
            INSERT INTO icon (name, display_name, icon_type, icon_content, icon_format, sort_order, is_active)
            VALUES (?, ?, 'custom', ?, ?, ?, 1)
        `;

        const result = await pool.query(sql, [
            name,
            display_name || '自定义图标',
            icon_content,
            icon_format || 'png',
            sort_order || 0
        ]);

        ctx.body = {
            code: 200,
            msg: '创建成功',
            data: { 
                id: result[0].insertId,
                name: name,
                reference: `custom:${result[0].insertId}`
            }
        };

    } catch (err) {
        console.error('创建图标失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.post('/batch', async (ctx) => {
    const { icons } = ctx.request.body;

    if (!Array.isArray(icons) || icons.length === 0) {
        ctx.body = {
            code: 400,
            msg: '图标列表不能为空'
        };
        return;
    }

    try {
        const results = [];

        for (const icon of icons) {
            if (!icon.icon_content) continue;

            const timestamp = Date.now() + Math.random();
            const name = `custom_${timestamp}`;

            const sql = `
                INSERT INTO icon (name, display_name, icon_type, icon_content, icon_format, sort_order, is_active)
                VALUES (?, ?, 'custom', ?, ?, ?, 1)
            `;

            const result = await pool.query(sql, [
                name,
                icon.display_name || '自定义图标',
                icon.icon_content,
                icon.icon_format || 'png',
                icon.sort_order || 0
            ]);

            results.push({
                id: result[0].insertId,
                name: name,
                reference: `custom:${result[0].insertId}`,
                display_name: icon.display_name
            });
        }

        ctx.body = {
            code: 200,
            msg: '批量创建成功',
            data: results
        };

    } catch (err) {
        console.error('批量创建图标失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.put('/:id', async (ctx) => {
    const iconId = ctx.params.id;
    const { display_name, icon_content, icon_format, sort_order, is_active } = ctx.request.body;

    try {
        const checkSql = `SELECT * FROM icon WHERE id = ?`;
        const [icons] = await pool.query(checkSql, [iconId]);

        if (icons.length === 0) {
            ctx.body = {
                code: 404,
                msg: '图标不存在'
            };
            return;
        }

        const currentIcon = icons[0];

        if (currentIcon.icon_type === 'system') {
            ctx.body = {
                code: 403,
                msg: '系统预设图标不可修改'
            };
            return;
        }

        const updateSql = `
            UPDATE icon
            SET display_name = ?, icon_content = ?, icon_format = ?, sort_order = ?, is_active = ?
            WHERE id = ?
        `;

        await pool.query(updateSql, [
            display_name !== undefined ? display_name : currentIcon.display_name,
            icon_content !== undefined ? icon_content : currentIcon.icon_content,
            icon_format !== undefined ? icon_format : currentIcon.icon_format,
            sort_order !== undefined ? sort_order : currentIcon.sort_order,
            is_active !== undefined ? (is_active ? 1 : 0) : currentIcon.is_active,
            iconId
        ]);

        ctx.body = {
            code: 200,
            msg: '更新成功'
        };

    } catch (err) {
        console.error('更新图标失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

router.delete('/:id', async (ctx) => {
    const iconId = ctx.params.id;

    try {
        const checkSql = `SELECT * FROM icon WHERE id = ?`;
        const [icons] = await pool.query(checkSql, [iconId]);

        if (icons.length === 0) {
            ctx.body = {
                code: 404,
                msg: '图标不存在'
            };
            return;
        }

        const currentIcon = icons[0];

        if (currentIcon.icon_type === 'system') {
            ctx.body = {
                code: 403,
                msg: '系统预设图标不可删除'
            };
            return;
        }

        const deleteSql = `DELETE FROM icon WHERE id = ?`;
        await pool.query(deleteSql, [iconId]);

        ctx.body = {
            code: 200,
            msg: '删除成功'
        };

    } catch (err) {
        console.error('删除图标失败:', err);
        ctx.body = {
            code: 500,
            msg: '数据库错误',
            error: err.message
        };
    }
});

module.exports = router;
