;(function(window, document) {
  
  var $Dropdown = function(selector, dropdownSelector) {
    var inputElement = document.querySelector(selector);
    var dropdownElement = document.querySelector(dropdownSelector);
    if (!inputElement && inputElement.tagName !== 'INPUT' && !dropdownElement) {
      throw new DOMError(`element ${selector} is not exist or not a input element!`);
    }
    this.inputElement = inputElement;
    this.dropdownElement = dropdownElement;
    this.memory = [];
    this.current = [];
    this.unOrderList;
  }

  $Dropdown.prototype.addHandler = function(element, event, handler) {
    if (element.addEventListener) {
      element.addEventListener(event, handler.bind(this));
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, handler.call(window.event, this));
    } else {
      element['on' + event] = handler.bind(this);
    }
  }

  $Dropdown.prototype.init = function(searchArray, config) {
    this.searchArray = searchArray;
    this.addHandler(this.inputElement, 'focus', this.handleFocus);
    /**
     * 这里需要使用keyup事件，原因是几个和按键以及文本框改变的事件会存在一些问题
     * 
     * 首先想到的change事件只会在文本框内容被修改，并且文本框失去焦点的时候会被触发，
     * 这样存在的问题就是不能够根据用户的输入实时更新当前的匹配结果
     * 
     * 其次是键盘事件，但是keypress事件是在按下按键之后，产生了一个值的时候触发，这个
     * 时候具体的文本框内容却还没有发生改变，所以这个事件也被否定了。
     * 
     * 而keydown事件就更不用说了，这个事件连值都还没产生。
     * 
     * 所以最后剩下的事件就是keyup事件了，这个事件会在完成了整个按键操作，包括
     * 按下，产生值，写入input，松开按键之后触发，
     * 上面的顺序也是整个DOM中键盘事件的触发顺序。
     * 
     */
    this.addHandler(this.inputElement, 'keyup', this.handleFocus);
    /**
     * 这里使用mousedown，而不是click事件的原因在于：
     * 由于需要设置blur事件，来让input元素失去焦点的时候，隐藏下拉菜单，
     * 由于blur事件的触发要早于click事件，所以会导致click事件不能够正确获取值，
     * 必须使用比blur事件触发的更早mousedown事件来进行li元素的点击处理。
     */
    this.addHandler(this.dropdownElement, 'mousedown', this.handleListClick);
    this.addHandler(this.inputElement, 'blur', this.handleBlur);
  }
  
  $Dropdown.prototype.handleKeyPress = function(event) {
    this.handleSearch();
  }

  $Dropdown.prototype.handleFocus = function(event) {
    var that = this;
    setTimeout(function() {
      that.handleSearch();
    }, 1);
  }

  $Dropdown.prototype.handleBlur = function(event) {
    removeClass(this.dropdownElement, 'show');
  }

  $Dropdown.prototype.handleSearch = function() {
    var content = this.inputElement.value;
    if (!content) {
      this.createList(this.memory.reverse());
      return true;
    }
    var showArray = [];
    for (var i = 0; i < this.searchArray.length; i++) {
      var value = this.searchArray[i];
      ~value.indexOf(content) && showArray.push(value);
    }
    this.current = showArray;
    this.createList(this.current);
    return true;    
  }

  $Dropdown.prototype.handleListClick = function(event) {
    console.log(`click target is ${event.target}`);
    var target = event.target;
    if (target.tagName === 'LI') {
      this.inputElement.value = target.textContent;
      !~this.memory.indexOf(target.textContent) && this.memory.push(target.textContent);
      this.handleSearch();
    }
  }

  $Dropdown.prototype.createList = function(selectorArray) {
    var showArray = selectorArray;
    var unOrderList = document.createElement('ul');
    for (var i = 0; i < showArray.length && i < 10; i++) {
      var list = document.createElement('li');
      list.textContent = showArray[i];
      unOrderList.appendChild(list);
    }
    // 这里移除的节点NodeList会在重新赋值之后被回收，不会造成内存泄漏
    this.unOrderList && this.dropdownElement.removeChild(this.unOrderList);
    this.dropdownElement.appendChild(unOrderList);
    this.unOrderList = unOrderList;
    addClass(this.dropdownElement, 'show');
  }

  var addClass = function(element, newClass) {
    var className = element.className;
    var classList = className.trim().split(' ');
    var toString = Object.prototype.toString;
    if (toString.call(classList) === '[object Array]') {
      !~classList.indexOf(newClass) && classList.push(newClass);
      element.className = classList.join(' ');
      return;
    }
    element.className = newClass.trim();
  }

  var removeClass = function(element, deleteClass) {
    var className = element.className;
    var classList = className.trim().split(' ');
    if (!~classList.indexOf(deleteClass)) {
      return;
    }
    classList[classList.indexOf(deleteClass)] = '';
    element.className = classList.join(' ').trim();
  }

  var toggleClass = function(element, className) {
    var classList = element.className.trim().split(' ');
    ~classList.indexOf(className) ? removeClass(element, className) : addClass(element, className);
  }


  Object.defineProperty(window, '$Dropdown', {
    value: $Dropdown,
    enumerable: true,
    writable: false,
    configurable: false
  });
})(window, document);