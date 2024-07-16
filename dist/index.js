"use strict";
// getUserName: Selects the input element with the ID user and asserts that it is an HTMLInputElement.
// formSubmit: Selects the form element with the ID form and asserts that it is an HTMLFormElement.
// main_container: Selects the element with the class main_container and asserts that it is an HTMLElement.
const getUserName = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
// const formSubmit:HTMLFormElement | null=document.querySelector("#form") as HTMLFormElement;//We can write this way also
const main_container = document.querySelector(".main_container");
//reusable function
// myCustomFetcher: A generic function to fetch data from a given URL.
// T: A generic type parameter allowing this function to be reusable for different types of data.
// url: The endpoint to fetch data from.
// options: Optional fetch options.
// Fetches data and checks if the response is okay. If not, throws an error.
// Parses the response as JSON and returns the data.
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok-status:${response.status}`);
    }
    const data = await response.json();
    return data;
}
// showResultUI: A function to update the UI with user data.
// Destructures the singleUser object to extract avatar_url, login, and url.
// Uses insertAdjacentHTML to insert a new card into main_container with the user's avatar, login, and a link to their GitHub profile.
const showResultUI = (singleUser) => {
    //our whole will be going inside this insertAdjacentHTML
    const { avatar_url, login, url, location } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class='card'>
        <img src=${avatar_url} alt=${login}/>
        <hr />
        <div class ="card-footer">
            <img src="${avatar_url}" alt="${login}" />
            <a href ="${url}"> Github </a>
        </div>
        </div>
        `);
};
// fetchUserData: Fetches user data from the provided URL.
// Uses myCustomFetcher to fetch an array of UserData.
// Iterates over the fetched user data and calls showResultUI for each user.
// Logs the login name of each user to the console.
function fetchUserData(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
            console.log("login " + singleUser.login);
        }
    });
}
// Calls fetchUserData with the GitHub API URL to fetch and display initial user data.
fetchUserData("https://api.github.com/users");
//performing search function
// Adds an event listener to the form for the submit event.
// e.preventDefault(): Prevents the form from submitting the traditional way.
// Retrieves the search term from the input field and converts it to lowercase.
// Fetches all user data from the GitHub API.
// Filters the users to find matches based on the search term.
// Clears the previous search results from main_container.
// If no matching users are found, inserts a message indicating no matches.
// Otherwise, calls showResultUI for each matching user to display their data.
// Catches and logs any errors that occur during the fetch process.
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchterm = getUserName.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher(url, {});
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchterm);
        });
        //we need to clear previous data
        main_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            main_container?.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
