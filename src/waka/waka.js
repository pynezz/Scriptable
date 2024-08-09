/* CREDITS

	This is a Scriptable script to fetch data from a private Wakapi 
	instance by pynezz (https://github.com/pynezz)
		
	Wakapi is a Wakatime interoperable self-hosted API integration.

	-------------------------------------
	Credits:
		- https://wakapi.dev
		- https://github.com/muety/wakapi
	-------------------------------------
*/


const instance = 'https://httpcats.com/404.jpg'; // ! Add me
const user = 'ADDME';
const authKey = "Basic " + ADDME // base64-encode API-key 

async function createWidget(data) {
  console.log(`Creating widget with data: ${JSON.stringify(data)}`);

  const widget = new ListWidget();
  const bgColor = new LinearGradient();
  bgColor.colors = [new Color("#1c1c1e"), new Color("#2c2c2e")];
  bgColor.locations = [0.0, 1.0];
  widget.backgroundGradient = bgColor;
  widget.setPadding(10, 10, 10, 10);

  const stack = widget.addStack();
  stack.layoutVertically();
  stack.spacing = 4.85;
  stack.size = new Size(320, 0);

  // Line 0 - Title
  const titleLine = stack.addText(`WakaStats for ${user} | Last 14 Days`);
  titleLine.textColor = Color.white();
  titleLine.textOpacity = 0.7;
  titleLine.font = new Font("Menlo-Regular", 12);

  // Line 1 - Languages
  const languagesLine = stack.addText(
  	`🌎 Top Languages: ${data.languages.map(lang => lang.name).join(", ")}`
  );
  languagesLine.textColor = Color.white();
  languagesLine.font = new Font("Menlo-Regular", 12);

  // Line 2 - Language Hours
  data.languages.forEach(lang => {
    const line = stack.addText(`- ${lang.name}: ${lang.hours} hrs`);
    line.textColor = Color.white();
    line.font = new Font("Menlo-Regular", 12);
  });

  // Line 3 - Total Coding Time
  const totalLine = stack.addText(`⌛️ Total Time: ${data.totalTime} hrs`);
  totalLine.textColor = Color.white();
  totalLine.font = new Font("Menlo-Regular", 12);

  // Line 4 - Last Updated
  const updatedTime = stack.addText('Last updated: ' + new Date().toLocaleString());
  updatedTime.textColor = Color.white();
  updatedTime.textOpacity = 0.7;
  updatedTime.font = new Font("Menlo-Regular", 7);

  return widget;
}

async function fetchData() {
  const endpoint = `https://${instance}/api/compat/wakatime/v1/users/${user}/stats/last_14_days`;
  const req = new Request(endpoint);
  req.headers = { "Authorization": authKey };
  const res = await req.loadJSON();

  if (res && res.data) {
    const languages = res.data.languages.sort(
    	(a, b) => b.total_seconds - a.total_seconds).slice(0, 3).map(lang => ({
      		name: lang.name,
      		hours: (lang.total_seconds / 3600).toFixed(1)
    	})
    );
    const totalTime = (res.data.languages.reduce(
    	(sum, lang) => sum + lang.total_seconds, 0) / 3600).toFixed(1);

    return { languages, totalTime };
  } else {
    return { languages: [], totalTime: 0 };
  }
}

const data = await fetchData();
const widget = await createWidget(data);

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}

Script.complete();
