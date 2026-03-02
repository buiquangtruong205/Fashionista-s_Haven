import os

files_to_delete = [
    'activate_admin.js',
    'add_password_change_columns.js',
    'add_product_images_table.js',
    'add_status_column.js',
    'api_docs.md',
    'check_users_table.js',
    'console.error(e))',
    'database_schema.sql',
    'find_db_port.js',
    'fix_varchar_overflow.js',
    'initialize_database.js',
    'list_admins.js',
    'list_all_users.js',
    'list_dbs.js',
    'simple_check.js',
    'test_write.txt',
    'verify_db.js'
]

cwd = os.getcwd()
print(f"Current directory: {cwd}")

for file in files_to_delete:
    try:
        if os.path.exists(file):
            os.remove(file)
            print(f"Deleted: {file}")
        else:
            print(f"Not found: {file}")
    except Exception as e:
        print(f"Failed to delete {file}: {e}")
