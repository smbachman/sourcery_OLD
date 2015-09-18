import config from './sourceryConfig';
import githubDb from 'js-github/mixins/github-db';
import createTree from 'js-git/mixins/create-tree';
import addCache from 'js-git/mixins/add-cache';
import memCache from 'js-git/mixins/mem-cache';
import readCombiner from 'js-git/mixins/read-combiner';
import formats from 'js-git/mixins/formats';
import indexedDb from 'js-git/mixins/indexed-db';
import run from 'gen-run';

let repo = {};

githubDb(repo, config.repository, config.token);
createTree(repo);
//addCache(repo, indexedDb);
memCache(repo);
readCombiner(repo);
formats(repo);

run(function* () {
  let headHash = yield repo.readRef('refs/heads/master');
  let commit = yield repo.loadAs('commit', headHash);
  let tree = yield repo.loadAs('tree', commit.tree);
  let entry = tree['README.md'];
  let readme = yield repo.loadAs("text", entry.hash);
  console.log(readme);
  // let updates = [
  //   {
  //     path: "README.md",
  //     mode: entry.mode,
  //     content: readme.toUpperCase()
  //   }
  // ];
  // updates.base = commit.tree;
  // let treeHash = yield repo.createTree(updates);
  // let commitHash = yield repo.saveAs("commit", {
  //   tree: treeHash,
  //   author: {
  //     name: "Scott Bachman",
  //     email: "scott.bachman@gmail.com"
  //   },
  //   parent: headHash,
  //   message: "Change README.md to be all uppercase using js-github"
  // });
  // yield repo.updateRef("refs/heads/master", commitHash);
});