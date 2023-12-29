var isAlertDismissed = localStorage.getItem('alertDismissed');
if (isAlertDismissed) {
  document.getElementById('announcement').style.display = 'none';
}

function dismissAlert() {
  document.getElementById('announcement').style.display = 'none';
  localStorage.setItem('alertDismissed', 'true');
}