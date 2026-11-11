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

// "Submit a citation": toggle the form and compose a pre-filled email.
(function () {
  var open = document.getElementById("cite-open");
  var form = document.getElementById("cite-form");
  if (!open || !form) return;
  open.addEventListener("click", function () {
    form.hidden = !form.hidden;
    open.setAttribute("aria-expanded", String(!form.hidden));
    if (!form.hidden) form.querySelector("input").focus();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(form);
    var ds = f.getAll("datasets");
    var body = [
      "Paper: " + (f.get("title") || ""),
      "Authors: " + (f.get("authors") || ""),
      "Journal/series: " + (f.get("venue") || ""),
      "Link/DOI: " + (f.get("link") || ""),
      "Datasets used: " + (ds.length ? ds.join(", ") : ""),
      "",
      "Submitted by: " + (f.get("name") || "") + (f.get("affil") ? " (" + f.get("affil") + ")" : "")
    ].join("\n");
    window.location.href = "mailto:" + form.dataset.email +
      "?subject=" + encodeURIComponent("Citation of your data: " + (f.get("title") || "")) +
      "&body=" + encodeURIComponent(body);
  });
})();
