const { spawn } = require('child_process');
const path = require('path');

function runProcess(command, args, name, cwd) {
    const proc = spawn(command, args, {
        shell: true,
        stdio: 'inherit',
        cwd: cwd
    });

    proc.on('error', (err) => {
        console.error(`[${name}] Failed to start:`, err);
    });

    proc.on('close', (code) => {
        console.log(`[${name}] Exited with code ${code}`);
    });

    return proc;
}

console.log('Starting Fashionista\'s Haven Application...');

// 1. Initialize Database first
console.log('\n--- Initializing Database ---');
const dbInit = spawn('node', ['initialize_database.js'], { shell: true, stdio: 'inherit' });

dbInit.on('close', (code) => {
    if (code !== 0) {
        console.error('Database initialization failed. Aborting...');
        process.exit(1);
    }

    console.log('\n--- Starting Backend and Frontend ---');

    // 2. Start Backend
    runProcess('node', ['server.js'], 'Backend', __dirname);

    // 3. Start Frontend
    runProcess('npm', ['run', 'dev'], 'Frontend', path.join(__dirname, 'client'));
});
