import { google } from "googleapis";

export async function append(row){

    

    const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      // we need to replace the escaped newline characters
      // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes
    );
    const sheets = google.sheets({ version: "v4", auth: jwt });
   
   // https://content-sheets.googleapis.com/v4/spreadsheets/1WCfb-T2bXPv5BuqUxyrWIHUWdlh8AajiJKgQAB7yOi8/values/Sheet1:append?responseDateTimeRenderOption=FORMATTED_STRING&includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=RAW&alt=json&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1",
      valueInputOption: 'RAW',
      resource: {values: [
         row
      ]}
    });

}

const extractdims = (arr)=>{
    return arr.reduce((acc,item, i)=>{
        return {
            ...acc,
            [`d${i+1}`] : item
        }
    },{})
}

const toobj = (arr)=>{

    return arr.reduce((acc, item, index)=>{
        const _item = JSON.parse(item);
        return {...acc,
                [index]: extractdims(_item)
        }
    },{});
}

const avg = (sums, total)=>{
  return Object.keys(sums).reduce((acc, ckey)=>{
    const chapter = sums[ckey];
    return Object.keys(chapter).reduce((acc, dimkey)=>{
      const dimensions = sums[ckey][dimkey];
      return Object.keys(dimensions).reduce((acc, qkey)=>{
        return {
          ...acc,
          [ckey] : {
            ...(acc[ckey] || {}),
            [dimkey] : {
               ...(acc[ckey] || {})[dimkey],
               [qkey] :  Math.round(sums[ckey][dimkey][qkey] / total),
            }
          }
        }
      },acc);
    },acc);
  },{});
}

//this is called when a single shape is clicked in the gallery!
export async function getAnswersById(){
    try {
        const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
        const jwt = new google.auth.JWT(
          process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          null,
          process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
          scopes
        );
        const sheets = google.sheets({ version: "v4", auth: jwt });
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.SPREADSHEET_ID,
          range: "Sheet1",
        });
    
        const [header,...chapters] = response.data.values;
        let sums = {};
        let total = 0;
        const results = (chapters||[]).reduce((acc, item, i)=>{
            const [id, date, ts, ...answers] = item;
            const _answers = toobj(answers);
            Object.keys(_answers).forEach((ckey)=>{
              const chapter = _answers[ckey];
              Object.keys(chapter).forEach((dimkey)=>{
                const dimensions = _answers[ckey][dimkey];
                Object.keys(dimensions).forEach((qkey)=>{
                  sums[ckey] = sums[ckey] || {};
                  sums[ckey][dimkey] = sums[ckey][dimkey] || {};
                  sums[ckey][dimkey][qkey] = Math.round((sums[ckey][dimkey][qkey] || 0) + Number(_answers[ckey][dimkey][qkey])); 
                });
              });
            });
            total += 1;
            return {...acc, [id]: {ts, answers:_answers}}
        },{})
       
        const averages = avg(sums,total);
        return {answers:results, averages};
      } catch (err) {
        console.log(err);
      }
}


export async function getAnswers(last=20){
    try {
      
        const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
        const jwt = new google.auth.JWT(
          process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          null,
          process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
          scopes
        );
        const sheets = google.sheets({ version: "v4", auth: jwt });
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.SPREADSHEET_ID,
          range: "Sheet1",
        });
    
        const [header,...chapters] = response.data.values;
       
        return (chapters||[]).reduce((acc, item)=>{
            const [id, date, ts, ...answers] = item;
            return [...acc, {ts, id, answers:toobj(answers)}]
        },[]).slice(-last);

        
      } catch (err) {
        console.log(err);
      }
}

