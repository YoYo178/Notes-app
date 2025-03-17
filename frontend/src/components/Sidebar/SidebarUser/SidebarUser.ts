function dropdownButtonOnClick(setAngle: React.Dispatch<React.SetStateAction<number>>, angle: number, setIsDropdownMenuVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    setAngle(180 - angle);
    setIsDropdownMenuVisible((180 - angle) === 180);
}

export const ButtonHandler = {
    dropdownButtonOnClick
}

// Dropdown options (TODO)
function profileOnClick() {
    console.log("Profile")
}

function logOutOnClick() {
    console.log("Log Out")
}

export const DropdownOptionHandler = {
    profileOnClick,
    logOutOnClick
}