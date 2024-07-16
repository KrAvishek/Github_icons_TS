"use strict";
const getUserName = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
// const formSubmit:HTMLFormElement | null=document.querySelector("#form") as HTMLFormElement;//We can write this way also
const main_container = document.querySelector(".main_container");
//reusable function
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok-status:${response.status}`);
    }
    const data = await response.json();
    return data;
}
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
function fetchUserData(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
            console.log("login " + singleUser.login);
        }
    });
}
//default function call
fetchUserData("https://api.github.com/users");
//performing search function
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
