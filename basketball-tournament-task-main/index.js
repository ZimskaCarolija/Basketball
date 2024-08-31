const fs = require('fs').promises;
const {GroupRound,SortGroups,QualifierSort,EliminationStage,SemiFinals,Finals} = require("./util/Game")
let groups = null;
let exibitions = null;
const groupSchedule = {'1':[[2,3],[0,1]],'2':[[1,3],[0,2]],'3':[[0,3],[1,2]]}
let groupsName = ['A', 'B', 'C'];
let qualifiers = [];
const readFiles = async () => {
    try {
        const groupsData = await fs.readFile("groups.json", 'utf8');
        const exibitionsData = await fs.readFile("exibitions.json", 'utf8');

        groups = JSON.parse(groupsData);
        exibitions = JSON.parse(exibitionsData);
    } catch (err) {
        console.error(err);
    }

};

const main = async () => {
    await readFiles();
    //console.log("Groups:", groups);
    //console.log("Exibitions:", exibitions);
    GroupRound('1',groups,groupSchedule,groupsName,exibitions);
    console.log("-----------------------")
    GroupRound('2',groups,groupSchedule,groupsName,exibitions);
    console.log("-----------------------")
    GroupRound('3',groups,groupSchedule,groupsName,exibitions);

    //Sortiranje
    SortGroups(groups,groupsName);

    qualifiers = QualifierSort(groups,groupsName);
    console.log("Hats")
    Object.keys(qualifiers).forEach(hat => {
        console.log("Hat: " +hat );
        qualifiers[hat].forEach(team => {
          console.log(team.Team +" Points: " +team.points + " Score Diff " + (team.scoredPoints - team.concededPoints));
        });
      })

    let semiFinals =  EliminationStage(qualifiers,exibitions);
    let finals = SemiFinals(semiFinals,exibitions);
    let ranking = Finals(finals,exibitions);

    console.log("Medals")
    for(let i=0;i<ranking.length;i++)
    {
        console.log((i+1)+". "+ ranking[i].Team);
    }
    //console.log(exibitions)
};

main();
