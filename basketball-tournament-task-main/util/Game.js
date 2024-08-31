const GroupRound = (round, groups, groupSchedule,groupsName,exibitions) => {
    console.log("Group round " + round);

    groupsName.forEach(groupName => {
        console.log("Group " + groupName);

   
        let group = groups[groupName];

     
        let currentRoundSchedule = groupSchedule[round];

     
        currentRoundSchedule.forEach(match => {
            Game(group[match[0]],group[match[1]],exibitions)
        });
        
    });

};
const Game = (obj1,obj2,exibitions)=>
{
    let time = Math.floor(Math.random() * (120 - 70 + 1)) + 70;
    let Chance1 = 50;
    let Chance2 = 50;
    let rankChance = 0.5;
    let exChance = 1.4;
    let diff = 0;
    if(obj1.FIBARanking>obj2.FIBARanking)
    {
        diff = obj1.FIBARanking - obj2.FIBARanking;
        Chance1 -= diff;
        Chance2 +=diff; 
    }
    else
    {
        diff = obj2.FIBARanking - obj1.FIBARanking;
        diff*=rankChance;
        Chance2 -= diff;
        Chance1 +=diff; 
    }
    //exibition chance
    exibitions[obj1.ISOCode].forEach(el=>{
        if(el.Opponent == obj2.ISOCode)
        {
            let resTemp = el.Result.split('-');
            if(parseInt(resTemp[0])>parseInt(resTemp[1]))
            {
                Chance1+=exChance
                Chance2-=exChance
            }
            else
            {
                Chance1-=exChance
                Chance2+=exChance
            }
        }
    })



    //console.log(Chance1 + " " + Chance2);
    let obj1Score = 0;
    let obj2Score = 0;
    do
    {
    for(let i = 0; i < time; i++) {
        let isPoint = Math.random() * 100;
        if(isPoint < 80) { 
            let score = Math.random() * 100;
            if(score < Chance1) { 
                let is3 = Math.random() * 100;
                if(is3 < 80) { 
                    obj1Score += 2;
                } else { 
                    obj1Score += 3;
                }
            } else {
                let is3 = Math.random() * 100;
                if(is3 < 80) { 
                    obj2Score += 2;
                } else { 
                    obj2Score += 3;
                }
            }
        }
        
    }
    time = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    }while(obj1Score == obj2Score)
    //Add exibitions
    exibitions[obj1.ISOCode].push({Date:'1/1/2025',Opponent:obj2.ISOCode,Result:obj1Score+"-"+obj2Score});
    exibitions[obj2.ISOCode].push({Date:'1/1/2025',Opponent:obj1.ISOCode,Result:obj2Score+"-"+obj1Score});


    obj1.points = (obj1.points || 0) + (obj1Score > obj2Score ? 2 : obj1Score < obj2Score ? 0 : 1);
    obj2.points = (obj2.points || 0) + (obj2Score > obj1Score ? 2 : obj2Score < obj1Score ? 0 : 1);
    
    obj1.scoredPoints = (obj1.scoredPoints || 0) + obj1Score;
    obj2.scoredPoints = (obj2.scoredPoints || 0) + obj2Score;
    
    obj1.concededPoints = (obj1.concededPoints || 0) + obj2Score;
    obj2.concededPoints = (obj2.concededPoints || 0) + obj1Score;

    if(obj1Score>obj2Score)
    {
        obj1.wins = obj1.wins+1||1;
        obj2.losses = obj2.losses+1||1;
    }
    else
    {
        obj2.wins = obj2.wins+1||1;
        obj1.losses = obj1.losses+1||1;
    }

    console.log( obj1.ISOCode + " - "  + obj2.ISOCode + " ("+obj1Score + " - " + obj2Score + ")");
    //console.log(obj1.ISOCode + " Points: " + obj1.points + ", Scored: " + obj1.scoredPoints + ", Conceded: " + obj1.concededPoints);
   // console.log(obj2.ISOCode + " Points: " + obj2.points + ", Scored: " + obj2.scoredPoints + ", Conceded: " + obj2.concededPoints);
    return [obj1Score , obj2Score];
}
const sortF = (group) => {
    return group.sort((teamA, teamB) => {

      if (teamB.points !== teamA.points) {
        return teamB.points - teamA.points;
      }
      

      const differenceA = teamA.scoredPoints - teamA.concededPoints;
      const differenceB = teamB.scoredPoints - teamB.concededPoints;
  
      return differenceB - differenceA;
    });
  };
const SortGroups = (groups,groupsName)=>
{
      groupsName.forEach(el => {
        groups[el] = sortF(groups[el]);
      });
      PrintGroups(groups,groupsName)
}
const PrintGroups = (group,groupName)=>{
    console.log("Group Results : ")
    groupName.forEach(el=>{
        console.log("Group "+el);
        let index = 1;
        group[el].forEach(el2=>{
            if(el2.wins == undefined)
                el2.wins =0;
            if(el2.losses == undefined)
                el2.losses = 0;
            console.log(index+". "+el2.Team + "    / "+el2.wins+" / "+el2.losses+" / "+el2.points+" / "+el2.scoredPoints+" / "+el2.concededPoints+" / "+ (el2.scoredPoints - el2.concededPoints));
            index++;
        });
      })
};
const QualifierSort=(groups,groupsName)=>{
    const extractTopTeams = (n) => {
        return ['A', 'B', 'C'].flatMap(el => {
            const sortedGroup = groups[el];
            return sortedGroup[n - 1] ? [sortedGroup[n - 1]] : [];
        });
    };


    const topTeams1 = extractTopTeams(1); 
    const topTeams2 = extractTopTeams(2); 
    const topTeams3 = extractTopTeams(3); 


    const allTopTeams = [...topTeams1, ...topTeams2, ...topTeams3];

     allTopTeams.slice(0,8);
     let hat = {};
    hat.D = [allTopTeams[0],allTopTeams[1]];
    hat.E = [allTopTeams[2],allTopTeams[3]];
    hat.F = [allTopTeams[4],allTopTeams[5]];
    hat.G = [allTopTeams[6],allTopTeams[7]];
    return hat;
}
const EliminationStage=(hat,exibitions)=>
{
    let match = [];
    let temp = [];
    let no1 = Math.floor(Math.random());
    
    temp.push(hat.D[no1]);
    let no2 = Math.floor(Math.random());
    temp.push(hat.G[no2]);
    let no3,no4;
    if(no1 == 0)
        no3 = 1
    else
        no3=0
    if(no2 == 0)
        no4 = 1
    else
        no4=0
    match.push(temp);
    temp = [];
    temp.push(hat.D[no3]);
    temp.push(hat.G[no4]);
    match.push(temp);

    temp = [];
    let no5 = Math.floor(Math.random());
    temp.push(hat.E[no5]);
    let no6 = Math.floor(Math.random());
    temp.push(hat.F[no6]);
    let no7,no8;
    if(no5 == 0)
        no7 = 1
    else
        no7=0
    if(no6 == 0)
        no8 = 1
    else
        no8=0
    match.push(temp);
    temp = [];
    temp.push(hat.E[no7]);
    temp.push(hat.F[no8]);
    match.push(temp);

    console.log("Elminations");
    let semiFinals = [];
    let game1Res = Game(match[0][0],match[0][1],exibitions);
    Progress(semiFinals,match[0][0],match[0][1],game1Res)

    let game2Res = Game(match[1][0],match[1][1],exibitions);
    Progress(semiFinals,match[1][0],match[1][1],game2Res)

    let game3Res = Game(match[2][0],match[2][1],exibitions);
    Progress(semiFinals,match[2][0],match[2][1],game3Res)

    let game4Res = Game(match[3][0],match[3][1],exibitions);
    Progress(semiFinals,match[3][0],match[3][1],game4Res)
    return semiFinals

}
const Progress=(array,obj1,obj2,result)=>{
    if(result[0]>result[1])
    {
        array.push(obj1);
        return obj2;
    }
    else
    {
        array.push(obj2);
        return obj1;
    }
};
const SemiFinals=(match,exibitions)=>{
    console.log("Semi Finals");
    
    let finals=[];
    let place3=[];
    let game1Res = Game(match[0],match[2],exibitions);
    place3.push(Progress(finals,match[0],match[2],game1Res));

    let game2Res = Game(match[1],match[3],exibitions);
    place3.push(Progress(finals,match[1],match[3],game2Res));
    return [finals,place3];
}
const Finals = (match,exibitions)=>{

    let finals = match[0];
    let place3 = match[1];
    let finalsRank = [];
    let P3=[];
    console.log("3-rd place ")
    let game1Res = Game(place3[0],place3[1],exibitions);
    Progress(P3,place3[0],place3[1],game1Res);
    console.log("Fnals");
    let game2Res = Game(finals[0],finals[1],exibitions);
    finalsRank.push(Progress(finalsRank,finals[0],finals[1],game2Res));
    finalsRank.push(...P3);
    return finalsRank


}
module.exports = {GroupRound,SortGroups,QualifierSort,EliminationStage,SemiFinals,Finals}
