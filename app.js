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
const managerQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter the manager's name:",
        validate: (value) => {
            let isValid = value.match(/^[a-z]+$/i);
            if (isValid) {
                return true;
            }
            return "Name missing or invalid! (not numbers or symbols)";
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
            return "ID number missing or invalid! (No letters or symbols)";
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter the manager's email:",
        validate: (value) => {
            let isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            if (isValid) {
                return true;
            }
            return "ID number missing or invalid! (No letters or symbols)"
        }
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Enter the manager's office number:",
        validate: (value) => {
            let isValid = value.match(/^[0-9]+$/);
            if (isValid) {
                return true;
            }
            return "Office number missing or invalid! (No letters or symbols)";
        }
    }
];

const addEmployee = [
    {
        type: "confirm",
        name: "confirmation",
        message: "Do you want to add another team member?"
    }
];

const employeeQuestions = [
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
            let isValid = value.match(/^[a-z]+$/i);
            if (isValid) {
                return true;
            }
            return "Name missing or invalid! (not numbers or symbols)";
        }
    },
    {
        type: "input",
        name: "id",
        message: "Enter the employee's id:",
        validate: (value) => {
            let isValid = value.match(/^[0-9]+$/);
            if (isValid) {
                return true;
            }
            return "ID number missing or invalid! (No letters or symbols)";
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter the manager's email:",
        validate: (value) => {
            let isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            if (isValid) {
                return true;
            }
            return "ID number missing or invalid! (No letters or symbols)"
        }
    },
    {
        when: (answers) => {
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
            return "Github missing or invalid!";
        }
    },
    {
        when: (answers) => {
            if (answers.role === "Intern") {
                return true;
            }
        },
        type: "input",
        name: "school",
        message: "Enter the intern's school:",
        validate: (value) => {
            let isValid = value.match(/[a-z]+/i);
            if (isValid) {
                return true;
            }
            return "School missing or invalid!";
        }
    }
];

/****** End of Questions Lists ******/

const completeTeam = [];

var moreMember = true;  // Boolean use to add more team members


/* NOT WORKING
function validateName(input) {
    const re = /[a-z]/;
    // Declare function as asynchronous, and save the done callback
    var done = this.async();
    const isValid = re.test(input.trim())
    // Do async part
    setTimeout(function () {
        if (!isValid) {
            // Pass the return value in the done callback
            done("Name missing or format invalid! Use only letters (A-Z).");
            return;
        }
        // Pass the return value in the done callback
        done(process.exit(0));
    }, 1000);
}
*/


async function buildTeam() {
    console.log("Enter the information about the team Manager:/n");
    await inquirer.prompt(managerQuestions)
        .then(function (answers) {
            var manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            console.log(manager);    //FOR TESTING
            completeTeam.push(manager);
        })
        .catch(err => console.log(err));

    do {
        await inquirer.prompt(addEmployee)
            .then(function (answers) {
                moreMember = answers.confirmation;
                console.log(moreMember);    //FOR TESTING
            })
            .catch(err => console.log(err));
        if (moreMember) {
            await inquirer.prompt(employeeQuestions)
                .then(function (answers) {
                    if (answers.role === "Engineer") {
                        var engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
                        completeTeam.push(engineer);
                    }
                    if (answers.role === "Intern") {
                        var intern = new Intern(answers.name, answers.id, answers.email, answers.school);
                        completeTeam.push(intern);
                    }
                })
                .catch(err => console.log(err));
        }
    } while (moreMember === true);
}

buildTeam();
console.log(completeTeam);    //FOR TESTING 


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.



/*function generateFile() {
    fs.writeFileSync(outputPath, render(completeTeam),"utf-8")
}*/