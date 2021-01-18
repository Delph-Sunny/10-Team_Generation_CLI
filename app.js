const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

/********* Questions Lists *********/
const managerQuestions = [  // First set of questions: for manager
    {
        type: "input",
        name: "name",
        message: "Enter the manager's name:",
        validate: (value) => {
            let isValid = value.match(/^[a-z\s\-]+$/i);
            if (isValid) {
                return true;
            }
            return "Name missing or invalid! (No numbers or symbols allowed except for dashes)";
        }
    },
    {
        type: "input",
        name: "id",
        message: "Enter the manager's 3 digits id:",
        validate: (value) => {
            let isValid = value.match(/^[0-9]{3}$/);
            if (isValid) {
                return true;
            }
            return "ID number missing or invalid! (No letters or symbols allowed)";
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter the manager's email:",
        validate: (value) => {
            let isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);  // Used different method than match
            if (isValid) {
                return true;
            }
            return "Email missing or invalid!"
        }
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Enter the manager's office number:",
        validate: (value) => {
            let isValid = value.match(/^[0-9]{1,4}$/);
            if (isValid) {
                return true;
            }
            return "Office number missing or invalid! (4 number max. No letters or symbols allowed)";
        }
    }
];

const addEmployee = [       // Question to add or not more employees
    {
        type: "confirm",
        name: "confirmation",
        message: "Do you want to add another team member?"
    }
];

const employeeQuestions = [     //Last set of question: for employees
    {
        type: "list",
        name: "role",
        message: "Choose the employee's role:",
        choices: ["Engineer", "Intern"]
    },
    {
        type: "input",
        name: "name",
        message: "Enter the employee's name:",
        validate: (value) => {
            let isValid = value.match(/^[a-z\s\-]+$/i);
            if (isValid) {
                return true;
            }
            return "Name missing or invalid! (No numbers or symbols allowed except for dashes)";
        }
    },
    {
        type: "input",
        name: "id",
        message: "Enter the employee's 3 digits id:",
        validate: (value) => {
            let isValid = value.match(/^[0-9]{3}$/);
            if (isValid) {
                return true;
            }
            return "ID number missing or invalid! (No letters or symbols)";
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter the employee's email:",
        validate: (value) => {
            let isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            if (isValid) {
                return true;
            }
            return "Email missing or invalid!"
        }
    },
    {
        when: (answers) => {                     // value to match in order to display the question
            if (answers.role === "Engineer") {
                return true;
            }
        },
        type: "input",
        name: "github",
        message: "Enter the employee's github:",
        validate: (value) => {
            let isValid = (/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i).test(value);
            if (isValid) {
                return true;
            }
            return "Github invalid!";
        }
    },
    {
        when: (answers) => {                    // value to match in order to display the question
            if (answers.role === "Intern") {
                return true;
            }
        },
        type: "input",
        name: "school",
        message: "Enter the intern's school:",
        validate: (value) => {
            let isValid = value.match(/^[a-z\d-\s]+$/i);
            if (isValid) {
                return true;
            }
            return "School missing or invalid! (No symbols allowed except for dashes)";
        }
    }
];

/****** End of Questions Lists ******/

const completeTeam = [];

var moreMember = true;  // Boolean use to add more team members


// Function to create and fill html result page
function generateFile(completeTeam) {
    // TO DO: you may need to check if the `output` folder exists and create it if it does not.
    fs.writeFileSync(outputPath, render(completeTeam), "utf-8");
}

async function buildTeam() {
    console.log("Enter the information about the team Manager:");
    console.log("");   // Add line in Terminal display
    await inquirer
        .prompt(managerQuestions)
        .then(function (answers) {
            var manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            completeTeam.push(manager);     // Add Manager object into array
        })
        .catch(err => console.log(err));
// Do while Loops to add employee until conditon false is met
    do {
        await inquirer
            .prompt(addEmployee)
            .then(function (answers) {
                moreMember = answers.confirmation;
                console.log("");
            })
            .catch(err => console.log(err));
        if (moreMember) {
            await inquirer
                .prompt(employeeQuestions)
                .then(function (answers) {
                    if (answers.role === "Engineer") {
                        var engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                        completeTeam.push(engineer);    // Add Engineer object into array
                    }
                    if (answers.role === "Intern") {
                        var intern = new Intern(answers.name, answers.id, answers.email, answers.school);
                        completeTeam.push(intern);      // Add Intern object into array
                    }
                })
                .catch(err => console.log(err));
        }
    } while (moreMember === true);
    generateFile(completeTeam)    // Call function to generate html file
}

// Call function to build the team
buildTeam();







