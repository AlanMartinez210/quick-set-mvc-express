import jquery from 'jquery';
import jqueryUI from "jquery-ui";

import '../scss/general/reset.scss';
import '../scss/app.scss';
import '../scss/pattern.scss';
import '../scss/component.scss';
import '../scss/style.scss';
import 'slick/slick.scss';
import 'slick/slick-theme.scss';
import 'jquery-ui-bundle';

/**
 * アプリケーションの基本機能を定義します。
 *
 * @export
 * @class baseApp
 */
export class baseApp {
  constructor(){
    window.$ = jquery;
    this.root = this._getRoot();
    this.ua = this._getUA();
  };
  init(fn) {
    // ===========
    // index run init before myApp init function here...
    $.datepicker.regional['ja'] = {
      closeText: '閉じる',
      prevText: '<前',
      nextText: '次>',
      currentText: '今日',
      monthNames: ['1月','2月','3月','4月','5月','6月',
      '7月','8月','9月','10月','11月','12月'],
      monthNamesShort: ['1月','2月','3月','4月','5月','6月',
      '7月','8月','9月','10月','11月','12月'],
      dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
      dayNamesShort: ['日','月','火','水','木','金','土'],
      dayNamesMin: ['日','月','火','水','木','金','土'],
      weekHeader: '週',
      dateFormat: 'yy/mm/dd',
      firstDay: 0,
      isRTL: false,
      showMonthAfterYear: true,
      yearSuffix: '年'};
      $.datepicker.setDefaults($.datepicker.regional['ja']);
      
      // jqueryの関数拡張
      $.fn.extend({
        dateVal: function(dateValue){
          if(dateValue){
            return $(this).val(dateValue.replace(/(\d{4})(\d{2})(\d{2})/,'$1/$2/$3'));
          }
          else{
            var baf = $(this).val();
            return baf.slice(0,4) + baf.slice(5,7) + baf.slice(8,10);
          }
        },
        shamHide: function(){
          $(this).addClass("dummy-hide");
        },
        shamShow: function(){
          $(this).removeClass("dummy-hide");
        },
        setValue: function(serverData){
          console.log(serverData);
          const formData = this[0];
          if(formData){
            Object.keys(serverData).forEach(key => {
              if(formData[key]){
                $(formData[key]).val(serverData[key]);
              }
            })
          }
        },
        clearForm: function(){
          if(this[0]){
            // formの取得
            const formData = this.find("input,select,textarea,radio,checkbox,[data-dummytag='input']");
            
            // エラー表示の要素の取得
            const errInput = this.find(".error-input");
            if(errInput.length){
              for(let i=0;i<errInput.length;i++){
                $(errInput[i]).removeClass("error-input");
              }
            }

            // ボトムラベルの初期化
            const bottomLabel = this.find(".bottom-label");
            if(bottomLabel.length){
              for(let i=0;i<bottomLabel.length;i++){
                $(bottomLabel[i]).text("");
              }
            }

            // 入力系要素の初期化
            for(let i=0;i<formData.length;i++){
              let crntEle = formData[i]
              if(crntEle){
                switch(crntEle.tagName){
                  case "INPUT":
                  case "TEXTAREA":
                    crntEle.value = "";
                    break;
                  case "DIV":
                    crntEle.textContent = null;
                    break;
                  case "SELECT":
                    $(crntEle).val("");
                  case "RADIO":
                  case "CHECK":
                    break;
                }
              }
            }
          }
        }
      })

    //= ===========
    fn();
  }
  _getRoot(){
    let Path = location.pathname;
    Path = Path ? Path.split("/") : [];
    return Path[Path.length-1];
  }
  gerUrl(){
    return location.href;
  }
  _getUA(){
    return navigator.userAgent;
  }
  isSmartPhone(){
    if(this.ua.indexOf("iPhone") > 0 || this.ua.indexOf("Android") > 0 && this.ua.indexOf("Mobile") > 0){
      return true;
    }
    return false;
  }
  isTablet(){
    if(this.ua.indexOf("iPad") > 0 || this.ua.indexOf("Android") > 0){
      return true;
    }
    return false;
  }
  isPC(){
    if(!this.isSmartPhone && !this.isTablet){
      return true;
    }
    return false;
  }
  ready(fn) {
    document.addEventListener('DOMContentLoaded', fn, false);
  }
  load(fn) {
    window.addEventListener('load', fn, false);
  }
}
