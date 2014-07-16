$(function(){

  // make UI
  // downloadButton
  var zipButton = $('<button>').attr({type:'button'}).attr({'id':'makeZip'}).text('make Zip!!');
  $('#courceContent').append(zipButton);
  zipButton.click(function(){
    this.disabled = true;
    zipButton.text("Loading");
    makeZip();
  });

  // checkBox
  var checkBox = $('<input>').addClass('checkBox').attr({type:'checkbox'});
  $('#courceContent').css({'background-image':"initial",position:'relative'});
  var progressBar = $('<progress>').attr({'value':0,'max':100}).attr({'id':'progressBar'});
  $('#courceContent').append(progressBar);
  $('#courceContent').prepend(checkBox.clone().css({left:'30px',position:'absolute',top:'23px'}));
  $('#courceContent').prepend($('<span>').text("All").css({left:'8px',position:'absolute',top:'21px'}));

  var checkBoxHeader = $('<th>').addClass('nowrap checkBoxHeader').attr({width:'5%'}).text("All\n");
  checkBoxHeader.append(checkBox.clone());
  var checkBoxCell = $('<td>').addClass('nowrap checkBoxCell').attr({width:'5%'});
  checkBoxCell.append(checkBox.clone());
  
  var count = 0;
  $('.courceContent table[summary!="レポート"]').each(function(){
    var checkBoxCellClone = checkBoxCell.clone();
    checkBoxCellClone.children('input').addClass('checkBox'+("00"+count).slice(-3)); // checkBox:001
    $(this).find('tr.heading').prepend(checkBoxHeader.clone());
    $(this).find('tr[class!=heading]').prepend(checkBoxCellClone);
    count++;
  });

  // SectionAllCheckBox
  $('.courceContent table[summary!="レポート"] .checkBoxHeader input').click(function(){
    var count = $('.courceContent table[summary!="レポート"] tr.heading').index($(this).parent().parent());
    var checked = this.checked;
    $('.checkBox'+("00"+count).slice(-3)).each(function(){
      this.checked = checked;
    });
  });

  // AllCheckBox
  $('#courceContent input').click(function(){
    var checked = this.checked;
    $('.checkBox').each(function(){
      this.checked = checked;
    });
  });

  // makeZip
  var zip;
  var progressStep;
  var makeZip = function() {
    zip = new JSZip();

    // List up checked box
    var downloadList = [];
    $('td .checkBox').each(function(){
      if ($(this)[0].checked) {
        var url = $(this).parent().next().children('a').attr('href');
        var fileName = $(this).parent().next().children('a').text().replace(/\(.*$/,"").replace(/(^\s*|\s*$)/g,"");
        downloadList.push({url:url,name:fileName});
      }
    });

    // If have no checked box, exit
    if (downloadList.length <= 0) {
      zipButton[0].disabled = false;
      zipButton.text("make Zip!!");
      return;
    }

    // downloadZip
    progressStep = Math.ceil(100.0/downloadList.length);
    progressBar[0].value = 0;
    downloadList.forEach(getFile);
    downloadZip();
  }

  // getFile
  function getFile(file) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file.url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
      zip.file(file.name,this.response,{binary: true});
      progressBar[0].value += progressStep;
    };
    xhr.send();
  };

  // downloadZip
  var downloadZip = function() {
    if (progressBar[0].value < 100) {
      setTimeout(downloadZip,1000);
    } else {
      var content = zip.generate({type:"blob"});
      // ClassName_Date.zip
      var zipName = document.title.replace(/.*学部\s*/,"") + "_" + getNow();
      saveAs(content, zipName+".zip");
      zipButton[0].disabled = false;
      zipButton.text("make Zip!!");
    }
  }

  var getNow = function() {
    var date = new Date();
    var now = date.getFullYear();
    now += ("0"+(date.getMonth()+1)).slice(-2);
    now += ("0"+date.getDate()).slice(-2);
    now += ("0"+date.getHours()).slice(-2);
    now += ("0"+date.getMinutes()).slice(-2);
    now += ("0"+date.getSeconds()).slice(-2);
    return now;
  }
});