## 一个用来测试DOM事件的历史记录搜索框

做了一点点的兼容

调用方式：

```
/**
  * @params inputSelector [string] 输入框的选择器
  * @params dropdownSelector [string] 下拉菜单的选择器
  * @params searchArray [array] 用于进行推荐的参数数组
  *
  */ 
var $dropdown = new $Dropdown(inputSelector, dropdownSelector);
$dropdown.init(searchArray);
```

效果：

![dropdown效果图](./resources/dropdown.png)