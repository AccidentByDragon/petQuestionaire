
const prompt = require('prompt-sync')({ sigint: true });
const compResults = require('./resultat.json');
const questionsAndAnswersData = require('./frfodata.json');
const fs = require('fs');
let isRunning = true;

while (isRunning === true) {
  console.log(`Frågeformulär Husdjur
  
  Välj ett alternativ:
  1. Gör Frågeformuläret:
  2. Läs upp tidigare resultat:
  3. Avlsuta:`);

  const userInput = Number(prompt().trim().toLowerCase());
  switch (userInput) {
    case 1:
      console.log(`Du skall nu göra frågeformuläret, den består av 15 ja/nej frågor, resultaten kommer sedan att sparas`);
      prompt(`tryck valfri knapp för att påbörja frågeformuläret:`);
      let questionsAnswered = 0
      let scores = { cat: 0, rabbit: 0, dog: 0, fish: 0 };
      for (let i = 0; i < 15; i++) {
        console.log(questionsAndAnswersData[0].questions[i].Question);
        console.log(`svar ja eller nej`);
        let frSvar = (prompt().trim().toLowerCase());
        if (frSvar === `ja`) {
          scores.cat = scores.cat + questionsAndAnswersData[0].questions[i]['answers yes'].Cat;
          scores.rabbit = scores.rabbit + questionsAndAnswersData[0].questions[i]['answers yes'].Rabbit;
          scores.dog = scores.dog + questionsAndAnswersData[0].questions[i]['answers yes'].Dog;
          scores.fish = scores.fish + questionsAndAnswersData[0].questions[i]['answers yes'].Fish;
          questionsAnswered = questionsAnswered + 1;
        } else if (frSvar === `nej`) {
          scores.cat = scores.cat + questionsAndAnswersData[0].questions[i]['answers no'].Cat;
          scores.rabbit = scores.rabbit + questionsAndAnswersData[0].questions[i]['answers no'].Rabbit;
          scores.dog = scores.dog + questionsAndAnswersData[0].questions[i]['answers no'].Dog;
          scores.fish = scores.fish + questionsAndAnswersData[0].questions[i]['answers no'].Fish;
          questionsAnswered = questionsAnswered + 1;
        } else {
          console.log(`Något blev fel eller så var ditt svar inte giltigt, frågeformuläret måstet tyvärr startas om`);
          prompt(`tryck valfri knapp för att fortsätta`);
          questionsAnswered = 0;
          break;
        }
      }
      const catProcent = ((scores.cat / questionsAndAnswersData[0].Points.Cat.maxpoints) * 100);
      const rabbitProcent = ((scores.rabbit / questionsAndAnswersData[0].Points.Rabbit.maxpoints) * 100);
      const fiskProcent = ((scores.fish / questionsAndAnswersData[0].Points.Fish.maxpoints) * 100);
      const hundProcent = ((scores.dog / questionsAndAnswersData[0].Points.Dog.maxpoints) * 100);
      let highestResultPoints;
      let highestResultProcent;
      let scoresArray = [scores.cat, scores.rabbit, scores.fish, scores.dog];
      scoresArray = scoresArray.sort((b, a) => a - b)
      let catRead = false;
      let rabbitRead = false;
      let fishRead = false;
      let dogRead = false;
      for (let i = 0; i < scoresArray.length; i++) {
        if (scoresArray[i] === scores.cat && catRead === false) {
          catRead = true;
          console.log(`Katt blev ${i + 1}, med ${scoresArray[i]} poäng vilket är ${catProcent} %`);
          if (i === 0) {
            highestResultPoints = "Katt: " + scoresArray[i];
            highestResultProcent = catProcent;
          }
        }
        if (scoresArray[i] === scores.rabbit && rabbitRead === false) {
          rabbitRead = true;
          console.log(`Kanin blev ${i + 1}, med ${scoresArray[i]} poäng vilket är ${rabbitProcent} %`);
          if (i === 0) {
            highestResultPoints = "Kanin: " + scoresArray[i];
            highestResultProcent = rabbitProcent;
          }
        }
        if (scoresArray[i] === scores.fish && fishRead === false) {
          fishRead = true;
          console.log(`Fisk blev ${i + 1}, med ${scoresArray[i]} poäng vilket är ${fiskProcent} %`);
          if (i === 0) {
            highestResultPoints = "Fisk: " + scoresArray[i];
            highestResultProcent = fiskProcent;
          }
        }
        if (scoresArray[i] === scores.dog && dogRead === false) {
          dogRead = true;
          console.log(`Hund blev ${i + 1}, med ${scoresArray[i]} poäng vilket är ${hundProcent} %`);
          if (i === 0) {
            highestResultPoints = "Hund: " + scoresArray[i];
            highestResultProcent = hundProcent;
          }
        }

      }
      const currentDate = Date();
      if (questionsAnswered >= 15) {
        curUserName = prompt("Skriv in ditt namn: ").trim().toLowerCase();
        compResults.curUSer["Användare: " + compResults.totalUsers] = {
          namn: curUserName,
          totalResultatpoäng: highestResultPoints,
          totalResultatprocent: highestResultProcent + " %",
          totalResultat: scores,
          date: currentDate
        }
        compResults.totalUsers++;
        fs.writeFile('resultat.json', JSON.stringify(compResults, null, 2), (err) => {
          if (err) throw err;
          console.log(`data written to file`)
        });
        questionsAnswered = 0;
      }
      break;
    case 2:
      if (compResults.totalUsers != 0) {
        console.log(compResults.curUSer)
      }
      else {
        console.log(`Det finns inga tidigare resultat!`);
      }
      prompt(`tryck valfri knapp för att fortsätta:`);
      break;
    case 3:
      isRunning = false;
      break;
    default:
      console.log(`Det du skrev in var inte ett alternativ försök igen!`);
  }
}