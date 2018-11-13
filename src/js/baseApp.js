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
      $.fn.isVisible = function() {
        return $.expr.filters.visible(this[0]);
      };
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
        getValue: function(){
          const $form = $(this);
          const formData = {};
          if($form.prop("tagName") === "FORM"){
            // form内の属性を取得
            const $formEle = $form.find("input,select,textarea,radio,checkbox,[data-dummytag='input']");
            $formEle.each(function(){
              const $t = $(this);
              const eleName = $t.prop("name");
              //nameがないものは弾く
              if(!eleName) return true

              switch($t.prop("tagName")){
                case "INPUT":
                case "TEXTAREA":
                  switch($t.prop("type")){
                    case "text":
                    case "textarea":
                    case "file":
                    case "hidden":
                      formData[eleName] = $t.val();
                      break;
                    case "radio":
                      if($t.prop("checked")){
                        formData[eleName] = $t.val();
                      }
                      break;
                    case "checkbox":
                        formData[eleName] = $t.prop("checked");
                      break;
                  }
                  break;
                case "SELECT":
                  formData[eleName] = $t.val();
                  break;
                case "DIV":
                case "SPAN":
                case "p":
                  if($t.data("dummytag") == "input"){
                    formData[eleName] = $t.text();
                  }
                  break;
              }
            });
          }
          return formData;
        },
        setValue: function(serverData){
          const $form = $(this);
          if($form.prop("tagName") === "FORM"){
            const $formEle = $form.find("input,select,textarea,radio,checkbox,[data-dummytag='input']");
            $formEle.each(function(){
              const $t = $(this);
              const item = serverData[$t.prop("name")];
              if(!item) return true;
              switch($t.prop("tagName")){
                case "INPUT":
                case "TEXTAREA":
                  switch($t.prop("type")){
                    case "text":
                    case "textarea":
                    case "file":
                    case "hidden":
                      $t.val(item);
                      break;
                    case "radio":
                      // TODO 後でテスト
                      break;
                    case "checkbox":
                      $t.prop("checked", Boolean(item));
                      break;
                  }
                  break;
                case "SELECT":
                  $t.val(item);
                  break;
                case "DIV":
                case "SPAN":
                case "p":
                  if($t.data("dummytag") == "input"){
                    $t.text(item);
                  }
                  break;
              }
            })
          }
        },
        clearForm: function(){
          const $form = $(this);
          if($form.prop("tagName") === "FORM"){

            // エラー表示の要素の取得
            const $errInput = $form.find(".error-input");
            $errInput.each(function(){
              $(this).removeClass("error-input");
            });

            // ボトムラベルの初期化
            const $bottomLabel = $form.find(".bottom-label");
            $bottomLabel.each(function(){
              $(this).text("");
            });

            // form内の属性を取得
            const $formEle = $form.find("input,select,textarea,radio,checkbox,[data-dummytag='input']");
            $formEle.each(function(){
              const $t = $(this);
              switch($t.prop("tagName")){
                case "INPUT":
                case "TEXTAREA":
                  switch($t.prop("type")){
                    case "text":
                    case "textarea":
                    case "file":
                    case "hidden":
                      $t.val("");
                      break;
                    case "radio":
                      $t.attr("checked") ? $t.prop("checked", true) : $t.prop("checked", false);
                      break;
                    case "checkbox":
                      $t.prop("checked", false);
                      break;
                  }
                  break;
                case "SELECT":
                  // 先頭のoptionのvalueを設定する。
                  $t.val($t.prop("options")[0].value);
                  break;
                case "DIV":
                case "SPAN":
                case "p":
                  if($t.data("dummytag") == "input"){
                    $t.text("");
                  }
                  break;
              }
            });
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
