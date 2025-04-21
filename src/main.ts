import { exec } from 'child_process';

async function main() {
  const command = 'docker ps --filter "name=nestjs-semi-monolith*"';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  console.log('Displaying Docker container processes:');
}

main();