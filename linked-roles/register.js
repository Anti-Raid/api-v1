const fetch = require("node-fetch");

const url = `https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/role-connections/metadata`;

/* 
   Supported Types: 
      number_lt=1 
      number_gt=2 
      number_eq=3 
      number_neq=4
      datetime_lt=5
      datetime_gt=6
      boolean_eq=7
      boolean_neq=8
*/
const body = [
  {
    key: 'supporter',
    name: 'Supporter',
    description: 'AntiRaid Supporter',
    type: 7,
  },
  {
    key: 'staff',
    name: 'Staff Member',
    description: 'AntiRaid Staff Member',
    type: 7,
  },
];

const response = await fetch(url, {
  method: 'PUT',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
  },
});

if (response.ok) {
  const data = await response.json();
  console.log(data);
} else {
  // throw new Error(`Error pushing discord metadata schema: [${response.status}] ${response.statusText}`);
  const data = await response.text();
  console.log(data);
}
