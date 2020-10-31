$(document).ready(function() {
  $.ajax({
    url: "tsv/Talks.tsv",
    success: handleTSV
  }); 
});
function trim(s) {
  var ls = s.length;
  while (s.substring(0,1) == ' ') s = s.substring(1, ls);
  while (s.substring(ls-1, ls) == ' ') s = s.substring(0, ls-1);
  return s;
}
function formatauthor(d, bold) {
  ans = "";
  me = "N. M. O'Boyle";
  metoo = "N. O'Boyle";
  if (bold && (d == me || d == metoo)) ans += "<b>";
  ans += d;
  if (bold && (d == me || d == metoo)) ans += "</b>";
  return ans;
}
function formatJACS(authorstring, bold) {
  if (typeof bold == 'undefined') bold=true;
  authors = authorstring.split("; ");
  ans = formatauthor(authors[0], bold);
  if (authors.length > 1) {
    if (authors.length > 2)
      for (var i=1; i<authors.length-1; i++)
        ans += ", " + formatauthor(authors[i], bold);
    ans += " and " + formatauthor(authors[authors.length - 1], bold);
  }
  return ans;
}
function formatMonth(month) {
  return ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month];
}
function removefinalperiod(text) {
  var l = text.length;
  if (text.substring(l-1)==".") text = text.substring(0, l-1);
  return text;
}
function toggle(elem) {
   e = document.getElementById(elem);
   if (e) {
        s = e.style.display;
        if (s=="block") e.style.display = 'none';
        else e.style.display = "block";
        }
   }

TSV = {
  authors: 0,
  title: 1,
  year: 2,
  month: 3,
  _location: 4,
  conference: 5,
  link: 6,
  linkalternative: 7,
  poster: 8,
  paper: 9,
  description: 10
};


function handleTSV(data) {
  var text = "";
  var lines = data.split("\n");
  var myparts = [];
  for (var i=1; i<lines.length; i++) {
    var parts = lines[i].split("\t");
    if (parts.length == 1) // sometimes an extraneous blank line at the end
      continue;
    myparts.push(parts);
  }
  
  for (var i=0; i<myparts.length; i++) {
    var parts = myparts[i];
    text += "<div class='paperentry'>\n";
    text += "<div class='papertitle'><span class='paperorder'>" + (myparts.length - i) + "</span>.&nbsp;\n";
    text += removefinalperiod(parts[TSV.title]) + "</div>\n";
    text += "<p class='pdetails'>";
    text += "<span class='paperauthors'>" + formatJACS(parts[0]) + "</span>.<br/>\n";
    text += "<span class='paperjournal'>" + removefinalperiod(parts[TSV.conference]) + "</span>.\n";
    text += "<span class='paperyear'>" + formatMonth(parts[TSV.month]) + " </span>";
    text += "<span class='paperyear'>" + parts[TSV.year] + "</span>,\n";
    text += "<span class='paperlocation'>" + parts[TSV._location] + "</span>.\n";
    if (parts[TSV.link]) {
      text += "[<a href='talks/" + parts[TSV.link] + "'>Link</a>]";
    }
    if (parts[TSV.linkalternative]) {
      text += parts[TSV.linkalternative];
    }
    if (parts[TSV.DOI]) {
      text += "[<a href='http://dx.doi.org/" + parts[TSV.DOI] + "'>Link</a>]";
    }
    if (parts[TSV.description]) {
      text += "<div id='deswrapper_" + i + "' style='display:none;'><div class='description' id='description_" + i + "'>" + parts[TSV.description] + "</div></div>";
    }
    text += "</div>\n";
  }
  document.getElementById("paperentries").innerHTML = text;
}
