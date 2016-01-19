function showMenu(targetId)
{
    if (document.getElementById)
    {
        target = document.getElementById(targetId);
        target.style.display = "block";
    }

}

function hideMenu(targetId)
{
    if (document.getElementById)
    {
        target = document.getElementById(targetId);
        target.style.display = "none";
    }

}