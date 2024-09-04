# 5장 기본적인 리펙토링 목표

## 요약

- 함수에는 **명시적 입력**과 **암시적 입력** 두가지 입력 방식이 있다.
- **명시적 입력**은 함수에 매개변수를 통한 입력을 말한다.
- **암시적 입력**은 비지역적 입력(렉시컬 환경의 상태값을 이용)과 this를 통한 암시적 입력이 있다. 이들은 사이드 이펙트를 일으킨다.
- 가능하면 암시적 입력보다 명시적 입력을 사용하는 것이 좋다.
- 사이드 이펙트는 테스트와 디자인을 어렵게 만드므로 최소화시키는 것이 좋다.
- 자바스크립트에서 접근 제어자를 이용해서 메서드와 프로퍼티를 감추려면 노출식 모듈 패턴(revealing module pattern)을 사용한다.

> 아래서 부터는 리펙토링 지침과 권장 방식을 하나씩 나열하며 설명을함.

## 소규모 함수 작성하기

### 분기점 줄이기

- 여기서 코드 분기점은 if같은 분기문을 이용해서 코드 실행 흐름의 분기점을 만드는 것을 말한다.
- 6개 이하의 분기점을 만드는 것 좋다.

```js
if (temperature > 30) {
  // 분기1
} else if (temperature > 20) {
  // 분기2
} else {
  // 분기3
  if (isNotTemperature(temp)) {
    // 분기4
  } else {
    // 분기5
  }
}
```

### 함수 기능 위임하기

- 코드가 너무 복잡해지만 코드를 다른 함수에게 위임할 수 있다.

```js
function outer(x, y) {
  // 기타 설정 코드
  return inner(x, y);
}
```

## 사이드 이펙트 줄이기

- 사이드 이펙트는 매개변수에 정의 하지 않은 값을 함수 내부에서 변경하거나, 자신 스코드 외부의 상태를 변경하는 동작을 말한다.
- 사이드 이펙트는 테스트를 어렵게 만들고 상태 추적과 버그 가능성을 증가시킨다. 가능하면 줄이는 것 이 좋다.
- JavaScript에서는 사이드 이펙트를 억지로 줄이기 보다는 추적하고 관리하는 것이 좋다.

```js
// DOM 조작도 사이드 이펙트다.
function changeButtonColor() {
  document.getElementById("myButton").style.backgroundColor = "red";
}
```

## 함수에 명시적인 매개변수를 사용하기

- 가능하면 사이드 이펙트를 일으키는 코드 보다는 매개변수를 통한 입력을 사용하는 것이 좋다.

## 외부 상태값 참조(외부에 선언된 값을 함수 내부에서 참조) 최소화 하기

- (렉시컬 환경에 있는 상태값을 함수가 매개변수에 명시하지 않고 내부적으로 참조하는 경우)
- 함수 매개변수가 아닌 함수가 선언된 환경에 있는 외부 상태값을 함수 내부에서 참조하거나 변경하는 경우를 말한다.
- 비지역적 입력은 사이드 이펙트 중 하나이다.
- 코드 복잡도가 증가할 경우(예, 코드가 200줄 정도로 증가) 변수 상태 변경 추적이 어려워지기 때문에 사용을 최소화 하는 것이 좋다.

```js
let conunt = 0;

function increament() {
  count++;
}
```

## 바인드와 화살표 함수를 통해 외부 상태값 참조(비지역적 입력) 최소화 하기

- 객체에서 this를 사용할 경우 해당 객체의 함수가 메서드로 쓰일 경우에는 this가 인스턴스를 가리킨다.
- 하지만 일반 함수로 호출되게 되면 this가 전역에 있는 this를 가리키게 된다.
- 이럴 경우를 방지하기 위해서 화살표 함수나 bind를 통해 해결 할 수 있다.

```js
// 문제가 되는 상황
class Person {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const person = new Person("Alice");

// 메서드로 호출 - 정상 작동
person.sayHello(); // 출력: Hello, my name is Alice

// 일반 함수로 호출 - 문제 발생
const greet = person.sayHello;
greet(); // 출력: Hello, my name is undefined
```

```js
class Person {
  constructor(name) {
    this.name = name;
  }

  // 화살표 함수로 메서드 정의
  sayHello = () => {
    console.log(`Hello, my name is ${this.name}`);
  };
}

const person = new Person("Charlie");
const greet = person.sayHello;
greet(); // 출력: Hello, my name is Charlie
```

## Revealing Module Pattern 패턴을 구현하기

- 즉시 실행함수를 통해 private 필드를 만들고 public으로 지정한 메서드와 프로퍼티만 리턴하는 방식
- 클로저를 사용함.

```js
var ShoppingCart = (function () {
  var items = [];
  var total = 0;

  function addItem(name, price) {
    items.push({ name: name, price: price });
    total += price;
  }

  function removeItem(index) {
    var removed = items.splice(index, 1)[0];
    total -= removed.price;
  }

  function getTotal() {
    return total;
  }

  function getItems() {
    return items.slice();
  }

  return {
    add: addItem,
    remove: removeItem,
    getTotal: getTotal,
    getItems: getItems,
  };
})();

ShoppingCart.add("Apple", 0.5);
ShoppingCart.add("Banana", 0.3);
console.log(ShoppingCart.getTotal()); // 0.8
console.log(ShoppingCart.getItems()); // [{name: 'Apple', price: 0.5}, {name: 'Banana', price: 0.3}]
ShoppingCart.remove(0);
console.log(ShoppingCart.getTotal()); // 0.3
```

- 리액트의 커스텀훅이랑 유사하다.
