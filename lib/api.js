import { google } from "googleapis";

export async function append(row){

    console.log("in google sheets append!", row);

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
    console.log("sheets", sheets);
    console.log("sheet id", process.env.SPREADSHEET_ID);

   // https://content-sheets.googleapis.com/v4/spreadsheets/1WCfb-T2bXPv5BuqUxyrWIHUWdlh8AajiJKgQAB7yOi8/values/Sheet1:append?responseDateTimeRenderOption=FORMATTED_STRING&includeValuesInResponse=true&insertDataOption=INSERT_ROWS&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=RAW&alt=json&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1",
      valueInputOption: 'RAW',
      resource: {values: [
         row
      ]}
    });

    console.log("response is", response);
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

        return (chapters||[]).reduce((acc, item, i)=>{
            const [id, date, ts, ...answers] = item;
            return {...acc, [id]: {ts, answers:toobj(answers)}}
        },{})

      
      } catch (err) {
        console.log(err);
      }
}


export async function getAnswers(){
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
        },[])

      
      } catch (err) {
        console.log(err);
      }
}

