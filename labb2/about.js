//Function to show an alert when feedback button is pressed
(function () {
  var btn = document.getElementsByClassName("feedback-body__submit")[0];
  btn.onclick = function () {
    alert("Feedback sent!");
  };
})();
