const db = require('../config/database');

// Helper to convert SQLite '?' parameters to PostgreSQL '$1', '$2', etc.
const convertSql = (sql) => {
    let i = 0;
    return sql.replace(/\?/g, () => `$${++i}`);
};

const run = async (sql, params = []) => {
    const pgSql = convertSql(sql);
    try {
        const result = await db.query(pgSql, params);
        // Map PG result to SQLite-like result (for compatibility)
        // insertId is not natively returned unless we use RETURNING id.
        // For updates, 'changes' -> result.rowCount
        return {
            id: result.rows.length > 0 ? result.rows[0].id : null,
            changes: result.rowCount
        };
    } catch (err) {
        throw err;
    }
};

const get = async (sql, params = []) => {
    const pgSql = convertSql(sql);
    try {
        const result = await db.query(pgSql, params);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

const all = async (sql, params = []) => {
    const pgSql = convertSql(sql);
    try {
        const result = await db.query(pgSql, params);
        return result.rows;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    run,
    get,
    all
};
