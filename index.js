#!/usr/bin/env node

import { program } from 'commander';
import pc from 'picocolors';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

program
  .version('1.0.0')
  .description('Prepare to be judged based on your terrible git commit history.')
  .parse(process.argv);

const banner = `
    ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗
    ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝
    ██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║   
    ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║   
    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║   
     ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   
    ██████╗  ██████╗  █████╗ ███████╗████████╗
    ██╔══██╗██╔═══██╗██╔══██╗██╔════╝╚══██╔══╝
    ██████╔╝██║   ██║███████║███████╗   ██║   
    ██╔══██╗██║   ██║██╔══██║╚════██║   ██║   
    ██║  ██║╚██████╔╝██║  ██║███████║   ██║   
    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   
`;

console.log(pc.red(banner));
console.log(pc.gray('    Prepare to be judged.'));
console.log(pc.cyan('    Architected by @lakshanmuruganandam\n'));

try {
  const gitLog = execSync('git log -n 30 --pretty=format:"%h - %s"', { encoding: 'utf-8' });
  const commits = gitLog.split('\n').filter(Boolean);

  if (commits.length === 0) {
    console.log(pc.yellow("✨ No commits found. You haven't even started. Roast averted."));
    process.exit(0);
  }

  let roastScore = 0;
  let badCommits = [];

  const terriblePatterns = [
    /^(fix|bug|update|test|wip|temp|init)$/i,
    /^(fixed stuff|updated things|changes|more changes)$/i,
    /^asdf/i
  ];

  commits.forEach(commit => {
    const msg = commit.split(' - ')[1].trim();
    if (msg.length < 5) {
      roastScore += 10;
      badCommits.push({ commit, reason: 'Embarrassingly short' });
    } else if (terriblePatterns.some(regex => regex.test(msg))) {
      roastScore += 15;
      badCommits.push({ commit, reason: 'Vague garbage' });
    } else if (!msg.includes(' ') && msg.length > 10) {
      roastScore += 5;
      badCommits.push({ commit, reason: 'No spaces? Did you mash the keyboard?' });
    }
  });

  console.log(pc.bold(pc.white('🔥 Analyzing your last 30 commits...\\n')));

  setTimeout(() => {
    if (badCommits.length === 0) {
      console.log(pc.green('Wow... your commit history is surprisingly pristine. Are you a robot?'));
    } else {
      badCommits.slice(0, 5).forEach(bad => {
        console.log(pc.red(`❌ ${bad.commit}`));
        console.log(pc.gray(`   ↳ ${bad.reason}`));
      });

      console.log('');
      if (roastScore > 50) {
        console.log(pc.red(pc.bold('ROAST LEVEL: ABSOLUTE TRASH 🗑️')));
        console.log(pc.white('Your teammates definitely hate reviewing your PRs. Please try harder.'));
      } else if (roastScore > 20) {
        console.log(pc.yellow(pc.bold('ROAST LEVEL: SLOPPY 📉')));
        console.log(pc.white('You started off strong, then got lazy. Classic developer.'));
      } else {
        console.log(pc.green(pc.bold('ROAST LEVEL: ACCEPTABLE ✅')));
        console.log(pc.white('You have a few lazy moments, but overall, you are not a complete disaster.'));
      }
    }
    console.log('');
  }, 1500);

} catch (err) {
  console.log(pc.yellow('❌ Not a git repository, or no commits found.'));
}
