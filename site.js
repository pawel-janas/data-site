// Copy buttons for citation blocks and a filter for variable tables.
document.addEventListener("click", function (e) {
  var btn = e.target.closest(".copy");
  if (!btn) return;
  var box = btn.closest(".cite");
  var src = box && (box.querySelector("pre") || box.querySelector("p"));
  if (!src) return;
  var text = src.innerText.trim();
  function done(ok) {
    btn.textContent = ok ? "Copied" : "Select & copy";
    btn.classList.toggle("done", ok);
    if (!ok) {
      var r = document.createRange(); r.selectNodeContents(src);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1800);
  }
  try {
    navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
  } catch (err) { done(false); }
});

document.addEventListener("input", function (e) {
  if (!e.target.matches(".var-filter")) return;
  var q = e.target.value.toLowerCase();
  var rows = document.querySelectorAll(e.target.dataset.target + " tbody tr");
  rows.forEach(function (tr) { tr.style.display = tr.innerText.toLowerCase().indexOf(q) > -1 ? "" : "none"; });
});
