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

// Authors	Title	Journal	Abbreviation	Year	Volume	Startpage	Endpage	DOI	Affiliation	Tags	Abstract	Description	Coords	AccessLevel	HighlyAccessed

TSV = {
  authors: 0,
  title: 1,
  year: 2,
  month: 3,
  _location: 4,
  conference: 5,
  link: 6,
  poster: 7,
  paper: 8,
  description: 9
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
    if (parts[TSV.DOI]) {
      text += "[<a href='http://dx.doi.org/" + parts[TSV.DOI] + "'>Link</a>]";
    }
    if (parts[TSV.description]) {
      text += "[<a href='javascript:toggle(\"deswrapper_" + i + "\")'";
      text += " id='desbutton_" + i + "'>Description</a>]";
    }
    text += "</p>";
    if (parts[TSV.description]) {
      text += "<div id='deswrapper_" + i + "' style='display:none;'><div class='description' id='description_" + i + "'>" + parts[TSV.description] + "</div></div>";
    }
    text += "</div>\n";
  }
  document.getElementById("paperentries").innerHTML = text;
}

// The following is the original code
function handlejson(data) {
    var text = "";

    for (var i=0; i<data.feed.entry.length; i++) {
        text += "<div class='paperentry'>\n";
        var p = data.feed.entry[i];
        text += "<div class='papertitle'><span class='paperorder'>" + (data.feed.entry.length - i) + "</span>.&nbsp;\n";
        text += removefinalperiod(p.gsx$title.$t) + "</div>\n";
        text += "<p class='pdetails'>";
        text += "<span class='paperauthors'>" + formatJACS(p.gsx$authors.$t) + "</span>.<br/>\n";
        text += "<span class='paperjournal'>" + removefinalperiod(p.gsx$abbreviation.$t) + "</span>.\n";
        text += "<span class='paperyear'>" + p.gsx$year.$t + "</span>,\n";
        // Notes regarding handling the volumes and page numbers:
        // (1) Some journals don't use volumes, they just have the year (Dalton Trans.)
        // (2) A paper in press is indicated by the lack of a volume and startpage
        // (3) Some journals don't use endpages (BMC Bioinf.)
        if (!p.gsx$volume.$t & !p.gsx$startpage.$t) text+= "<span class='paperinpress'>In press</span>.\n";
        else {
          if (p.gsx$volume.$t) text += "<span class='papervolume'>" + p.gsx$volume.$t + "</span>,\n";
          if (p.gsx$endpage.$t) text += "<span class='paperpage'>" + p.gsx$startpage.$t + "-" + p.gsx$endpage.$t + "</span>.\n";
          else text += "<span class='paperpage'>" + p.gsx$startpage.$t + "</span>.\n";
        }
        if (p.gsx$doi.$t) {
          text += "[<a href='http://dx.doi.org/" + p.gsx$doi.$t + "'>Link</a>]";
        }
        if (p.gsx$abstract.$t) {
          text += "[<a href='javascript:toggle(\"abswrapper_" + i + "\")'";
          text += " id='absbutton_" + i + "'>Abstract</a>]";
        }
        if (p.gsx$description.$t) {
          text += "[<a href='javascript:toggle(\"deswrapper_" + i + "\")'";
          text += " id='desbutton_" + i + "'>Description</a>]";
        }
	if (p.gsx$accesslevel.$t == '2') {
          text += "&nbsp;<span class='openaccess'>Open Access</span>";
	}
	if (p.gsx$accesslevel.$t == '1') {
          text += "&nbsp;<span class='freeaccess'>Free Access</span>";
	}
	if (p.gsx$highlyaccessed.$t == '1') {
          text += "&nbsp;<span class='highlyaccessed'>Highly Accessed</span>";
	}
	if (p.gsx$accesslevel.$t == '0') {
        	text += '[<a href="mailto:baoilleach@gmail.com?subject=Paper request&body=Dear Dr O\'Boyle,%0A%0AI would appreciate if you could send me a reprint of the following paper:%0A%0A' + removefinalperiod(p.gsx$title.$t)+". " + formatJACS(p.gsx$authors.$t, false) + '. ' + removefinalperiod(p.gsx$abbreviation.$t) + '. ' + p.gsx$year.$t+", "+p.gsx$volume.$t+", "+p.gsx$startpage.$t+'.%0A%0AI am interested in this paper because [INSERT REASON OF INTEREST].%0A%0ARegards,%0A[INSERT NAME HERE]">Request PDF</a>]'; 
	}
        text += "</p>";
        if (p.gsx$abstract.$t) {
          text += "<div id='abswrapper_" + i + "' style='display:none;'><div class='description' id='abstract_" + i + "'>" + p.gsx$abstract.$t + "</div></div>";
        }
        if (p.gsx$description.$t) {
          text += "<div id='deswrapper_" + i + "' style='display:none;'><div class='description' id='description_" + i + "'>" + p.gsx$description.$t + "</div></div>";
        }
        text += "</div>\n";
      }
      document.getElementById("paperentries").innerHTML = text;
    }
