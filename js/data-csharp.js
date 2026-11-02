/* =========================================================
   SharpAcademy — полный курс C# (по мотивам оглавления Metanit)
   Фундамент языка: основы, ООП, продвинутые темы, библиотеки .NET.
   Эти модули добавляются В НАЧАЛО курса (перед backend-частью).
   ========================================================= */

const CSHARP_MODULES = [

  /* ====== 1. Введение в C# и .NET ====== */
  {
    id: "cs-intro",
    icon: "🚀",
    title: "Введение в C# и .NET",
    desc: "Что такое C# и платформа .NET, первая программа и структура проекта.",
    lessons: [
      {
        id: "cs-what", title: "Язык C# и платформа .NET", duration: "15 мин",
        theory: `
          <h3>Что такое C# и .NET</h3>
          <p><strong>C#</strong> — современный строго типизированный объектно-ориентированный язык от Microsoft. <strong>.NET</strong> — платформа, на которой выполняется код: среда выполнения (CLR), компилятор и огромная стандартная библиотека.</p>
          <ul>
            <li>Код C# компилируется в промежуточный язык <strong>IL</strong>, а затем CLR исполняет его.</li>
            <li>На C# и .NET пишут веб-API, десктоп, мобильные приложения (MAUI), игры (Unity), облачные сервисы.</li>
            <li>.NET — кроссплатформенный: Windows, Linux, macOS.</li>
          </ul>
        `,
        example: { lang: "csharp", note: "Классическая первая программа.",
          code: `// Program.cs
Console.WriteLine("Привет, мир!");` },
        tasks: [
          { t: "Вывод строки", d: "easy", desc: "Выведи в консоль «Я учу C#».", input: "—", output: "Я учу C#",
            hint: "Console.WriteLine(...)", solution: `Console.WriteLine("Я учу C#");` },
          { t: "Что такое IL?", d: "easy", desc: "Объясни в комментарии, во что компилируется код C#.", input: "—", output: "— (теория)",
            hint: "Промежуточный язык.", solution: `// Код C# компилируется в промежуточный язык IL,
// который затем исполняет среда выполнения CLR.` }
        ]
      },
      {
        id: "cs-first", title: "Первая программа и .NET CLI", duration: "18 мин",
        theory: `
          <h3>Создание проекта через CLI</h3>
          <p>.NET CLI — консольный инструмент для работы с проектами. Главные команды:</p>
          <ul>
            <li><code class="inline">dotnet new console -n MyApp</code> — создать консольный проект</li>
            <li><code class="inline">dotnet run</code> — собрать и запустить</li>
            <li><code class="inline">dotnet build</code> — только собрать</li>
            <li><code class="inline">dotnet add package Имя</code> — установить NuGet-пакет</li>
          </ul>
        `,
        example: { lang: "csharp", note: "Создание и запуск проекта в терминале.",
          code: `// В терминале:
// dotnet new console -n HelloApp
// cd HelloApp
// dotnet run

Console.WriteLine("Проект запущен!");` },
        tasks: [
          { t: "Команда создания", d: "easy", desc: "Напиши команду для создания консольного проекта с именем Shop.", input: "—", output: "dotnet new console -n Shop",
            hint: "dotnet new console -n ...", solution: `// dotnet new console -n Shop` },
          { t: "Запуск", d: "easy", desc: "Какой командой собрать и запустить проект?", input: "—", output: "dotnet run",
            hint: "Одна команда.", solution: `// dotnet run` }
        ]
      },
      {
        id: "cs-structure", title: "Структура программы и метод Main", duration: "16 мин",
        theory: `
          <h3>Точка входа</h3>
          <p>Выполнение программы начинается с метода <code class="inline">Main</code>. В современном C# можно писать код прямо в файле — это <strong>top-level statements</strong> (программы верхнего уровня), а компилятор сам обернёт его в Main.</p>
        `,
        example: { lang: "csharp", note: "Классический Main и современный top-level стиль.",
          code: `// Классический вид
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Старт");
    }
}

// Современный top-level (то же самое):
// Console.WriteLine("Старт");` },
        tasks: [
          { t: "Метод Main", d: "easy", desc: "Напиши классический метод Main, выводящий «Hello».", input: "—", output: "Hello",
            hint: "static void Main(string[] args)", solution: `class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello");
    }
}` },
          { t: "Аргументы", d: "medium", desc: "Выведи первый аргумент командной строки (args[0]).", input: "args: hi", output: "hi",
            hint: "args — это string[].", solution: `Console.WriteLine(args[0]);` }
        ]
      }
    ]
  },

  /* ====== 2. Основы языка C# ====== */
  {
    id: "cs-basics",
    icon: "🔤",
    title: "Основы языка C#",
    desc: "Переменные, типы, операции, условия, циклы, массивы, методы.",
    lessons: [
      {
        id: "cs-vars", title: "Переменные, константы и литералы", duration: "20 мин",
        theory: `
          <h3>Хранение данных</h3>
          <p><strong>Переменная</strong> — именованная ячейка с типом и значением. <strong>Константа</strong> (<code class="inline">const</code>) не меняется после объявления.</p>
          <ul>
            <li><code class="inline">int age = 20;</code> — явный тип</li>
            <li><code class="inline">var name = "Umar";</code> — тип выводится компилятором</li>
            <li><code class="inline">const double Pi = 3.14;</code> — константа</li>
          </ul>
        `,
        example: { lang: "csharp", note: "Объявление переменных и константы.",
          code: `int age = 20;
string name = "Umar";
var isStudent = true;   // bool, выведен автоматически
const double Pi = 3.14159;

Console.WriteLine(name + ", возраст " + age);` },
        tasks: [
          { t: "Объяви переменные", d: "easy", desc: "Создай int count = 5 и string city = \"Dushanbe\", выведи их.", input: "—", output: "Dushanbe: 5",
            hint: "Склей строку через +.", solution: `int count = 5;
string city = "Dushanbe";
Console.WriteLine(city + ": " + count);` },
          { t: "Константа", d: "easy", desc: "Объяви константу максимального возраста = 120.", input: "—", output: "const",
            hint: "const int ...", solution: `const int MaxAge = 120;` }
        ]
      },
      {
        id: "cs-types", title: "Типы данных и преобразования", duration: "22 мин",
        theory: `
          <h3>Базовые типы</h3>
          <ul>
            <li><strong>Целые:</strong> <code class="inline">int</code>, <code class="inline">long</code>, <code class="inline">byte</code></li>
            <li><strong>Дробные:</strong> <code class="inline">double</code>, <code class="inline">float</code>, <code class="inline">decimal</code> (для денег)</li>
            <li><strong>Прочие:</strong> <code class="inline">bool</code>, <code class="inline">char</code>, <code class="inline">string</code></li>
          </ul>
          <h4>Преобразования</h4>
          <p>Неявное — когда без потерь (int → long). Явное (приведение) — когда возможна потеря: <code class="inline">(int)3.9</code>. Парсинг строки: <code class="inline">int.Parse</code> / <code class="inline">int.TryParse</code>.</p>
        `,
        example: { lang: "csharp", note: "Преобразование типов и парсинг.",
          code: `double d = 3.9;
int i = (int)d;            // явное: 3 (дробная часть отброшена)

string s = "42";
int n = int.Parse(s);      // строка -> число

bool ok = int.TryParse("abc", out int result); // ok = false, безопасно
Console.WriteLine(i + " " + n + " " + ok);` },
        tasks: [
          { t: "Приведение", d: "easy", desc: "Преврати double 7.8 в int через приведение и выведи.", input: "—", output: "7",
            hint: "(int)7.8", solution: `double d = 7.8;
int i = (int)d;
Console.WriteLine(i);` },
          { t: "Безопасный парсинг", d: "medium", desc: "С помощью TryParse проверь, число ли строка \"100\".", input: "\"100\"", output: "True, 100",
            hint: "int.TryParse(s, out int x)", solution: `bool ok = int.TryParse("100", out int x);
Console.WriteLine(ok + ", " + x);` }
        ]
      },
      {
        id: "cs-io-ops", title: "Ввод-вывод и операции", duration: "20 мин",
        theory: `
          <h3>Консоль</h3>
          <p><code class="inline">Console.WriteLine</code> — вывод, <code class="inline">Console.ReadLine</code> — ввод строки.</p>
          <h4>Операции</h4>
          <ul>
            <li>Арифметические: <code class="inline">+ - * / %</code></li>
            <li>Присваивания: <code class="inline">+= -= *= /=</code></li>
            <li>Сравнения: <code class="inline">== != &gt; &lt; &gt;= &lt;=</code></li>
          </ul>
        `,
        example: { lang: "csharp", note: "Ввод числа и арифметика.",
          code: `Console.Write("Введите число: ");
int x = int.Parse(Console.ReadLine());

int square = x * x;
int rem = x % 2;           // остаток от деления

Console.WriteLine("Квадрат: " + square);
Console.WriteLine(rem == 0 ? "Чётное" : "Нечётное");` },
        tasks: [
          { t: "Сумма двух", d: "easy", desc: "Считай два числа с консоли и выведи их сумму.", input: "2, 3", output: "5",
            hint: "int.Parse(Console.ReadLine()) дважды.", solution: `int a = int.Parse(Console.ReadLine());
int b = int.Parse(Console.ReadLine());
Console.WriteLine(a + b);` },
          { t: "Остаток", d: "easy", desc: "Выведи остаток от деления 17 на 5.", input: "—", output: "2",
            hint: "Оператор %", solution: `Console.WriteLine(17 % 5);` }
        ]
      },
      {
        id: "cs-conditions", title: "Условия: if, else, тернарный, switch", duration: "22 мин",
        theory: `
          <h3>Ветвление</h3>
          <p><code class="inline">if/else</code> выбирает ветку по условию. Тернарный оператор <code class="inline">условие ? a : b</code> — короткая форма. <code class="inline">switch</code> удобен при множестве вариантов.</p>
        `,
        example: { lang: "csharp", note: "if/else, тернарный и switch.",
          code: `int score = 85;

if (score >= 90) Console.WriteLine("Отлично");
else if (score >= 70) Console.WriteLine("Хорошо");
else Console.WriteLine("Нужно подтянуть");

string result = score >= 60 ? "Сдал" : "Не сдал";

string grade = score switch
{
    >= 90 => "A",
    >= 70 => "B",
    _ => "C"
};` },
        tasks: [
          { t: "Чёт/нечёт", d: "easy", desc: "Выведи «Чётное», если n делится на 2, иначе «Нечётное».", input: "n=7", output: "Нечётное",
            hint: "n % 2 == 0", solution: `Console.WriteLine(n % 2 == 0 ? "Чётное" : "Нечётное");` },
          { t: "switch по дню", d: "medium", desc: "По числу 1..7 выведи день недели через switch (1 → Понедельник).", input: "3", output: "Среда",
            hint: "switch expression с _ по умолчанию.", solution: `string day = n switch
{
    1 => "Понедельник", 2 => "Вторник", 3 => "Среда",
    4 => "Четверг", 5 => "Пятница", 6 => "Суббота", 7 => "Воскресенье",
    _ => "Неверный день"
};
Console.WriteLine(day);` }
        ]
      },
      {
        id: "cs-loops", title: "Циклы: for, while, foreach", duration: "22 мин",
        theory: `
          <h3>Повторение</h3>
          <ul>
            <li><code class="inline">for</code> — когда известно число повторений</li>
            <li><code class="inline">while</code> — пока условие истинно</li>
            <li><code class="inline">do..while</code> — выполнится хотя бы раз</li>
            <li><code class="inline">foreach</code> — перебор элементов коллекции</li>
          </ul>
          <p><code class="inline">break</code> прерывает цикл, <code class="inline">continue</code> переходит к следующей итерации.</p>
        `,
        example: { lang: "csharp", note: "Разные циклы.",
          code: `for (int i = 1; i <= 5; i++)
    Console.Write(i + " ");          // 1 2 3 4 5

int n = 0;
while (n < 3) { Console.Write("*"); n++; }

int[] nums = { 10, 20, 30 };
foreach (int x in nums) Console.Write(x + " ");` },
        tasks: [
          { t: "Сумма 1..100", d: "easy", desc: "Посчитай сумму чисел от 1 до 100 циклом for.", input: "—", output: "5050",
            hint: "Накапливай в sum.", solution: `int sum = 0;
for (int i = 1; i <= 100; i++) sum += i;
Console.WriteLine(sum);` },
          { t: "Факториал", d: "medium", desc: "Посчитай факториал числа 5 (5! = 120).", input: "5", output: "120",
            hint: "Умножай от 1 до n.", solution: `int f = 1;
for (int i = 1; i <= 5; i++) f *= i;
Console.WriteLine(f);` }
        ]
      },
      {
        id: "cs-arrays", title: "Массивы и задачи с ними", duration: "24 мин",
        theory: `
          <h3>Массивы</h3>
          <p>Массив — набор элементов одного типа фиксированного размера. Индексация с нуля.</p>
          <ul>
            <li><code class="inline">int[] a = new int[5];</code> — массив из 5 элементов</li>
            <li><code class="inline">int[] b = { 1, 2, 3 };</code> — с инициализацией</li>
            <li><code class="inline">a.Length</code> — длина</li>
          </ul>
        `,
        example: { lang: "csharp", note: "Поиск максимума в массиве.",
          code: `int[] nums = { 4, 7, 1, 9, 3 };

int max = nums[0];
for (int i = 1; i < nums.Length; i++)
    if (nums[i] > max) max = nums[i];

Console.WriteLine("Максимум: " + max); // 9` },
        tasks: [
          { t: "Сумма массива", d: "easy", desc: "Посчитай сумму элементов массива { 5, 10, 15 }.", input: "—", output: "30",
            hint: "foreach + накопление.", solution: `int[] a = { 5, 10, 15 };
int sum = 0;
foreach (int x in a) sum += x;
Console.WriteLine(sum);` },
          { t: "Минимум", d: "medium", desc: "Найди минимальный элемент массива { 8, 3, 6, 1, 9 }.", input: "—", output: "1",
            hint: "Аналогично максимуму, но с <.", solution: `int[] a = { 8, 3, 6, 1, 9 };
int min = a[0];
foreach (int x in a) if (x < min) min = x;
Console.WriteLine(min);` }
        ]
      },
      {
        id: "cs-methods", title: "Методы и параметры", duration: "26 мин",
        theory: `
          <h3>Методы</h3>
          <p>Метод — именованный блок кода. Имеет тип возврата, имя и параметры. <code class="inline">void</code> — ничего не возвращает; <code class="inline">return</code> возвращает значение.</p>
          <h4>Особые параметры</h4>
          <ul>
            <li><code class="inline">ref</code> — передача по ссылке</li>
            <li><code class="inline">out</code> — выходной параметр</li>
            <li><code class="inline">params</code> — переменное число аргументов</li>
          </ul>
        `,
        example: { lang: "csharp", note: "Метод с возвратом и params.",
          code: `int Add(int a, int b) => a + b;

int Sum(params int[] nums)
{
    int s = 0;
    foreach (int n in nums) s += n;
    return s;
}

Console.WriteLine(Add(2, 3));       // 5
Console.WriteLine(Sum(1, 2, 3, 4)); // 10` },
        tasks: [
          { t: "Метод умножения", d: "easy", desc: "Напиши метод int Multiply(int a, int b), возвращающий произведение.", input: "4,5", output: "20",
            hint: "return a * b;", solution: `int Multiply(int a, int b) => a * b;
Console.WriteLine(Multiply(4, 5));` },
          { t: "out-параметр", d: "medium", desc: "Напиши метод, который через out возвращает частное и остаток деления.", input: "17,5", output: "3, 2",
            hint: "void Div(int a,int b,out int q,out int r)", solution: `void Div(int a, int b, out int q, out int r)
{
    q = a / b; r = a % b;
}
Div(17, 5, out int q, out int r);
Console.WriteLine(q + ", " + r);` }
        ]
      },
      {
        id: "cs-recursion", title: "Рекурсия и локальные функции", duration: "20 мин",
        theory: `
          <h3>Рекурсия</h3>
          <p>Рекурсивная функция вызывает саму себя. Обязательно нужно <strong>условие выхода</strong> (база), иначе — бесконечный вызов и переполнение стека.</p>
          <p><strong>Локальная функция</strong> — метод, объявленный внутри другого метода.</p>
        `,
        example: { lang: "csharp", note: "Факториал через рекурсию.",
          code: `int Factorial(int n)
{
    if (n <= 1) return 1;       // база
    return n * Factorial(n - 1); // шаг
}

Console.WriteLine(Factorial(5)); // 120` },
        tasks: [
          { t: "Сумма до n", d: "medium", desc: "Рекурсивно посчитай сумму чисел от 1 до n.", input: "n=5", output: "15",
            hint: "База: n==0 -> 0.", solution: `int Sum(int n) => n == 0 ? 0 : n + Sum(n - 1);
Console.WriteLine(Sum(5));` },
          { t: "Фибоначчи", d: "hard", desc: "Выведи n-е число Фибоначчи рекурсивно (0,1,1,2,3,5...).", input: "n=6", output: "8",
            hint: "F(n)=F(n-1)+F(n-2), база n<2.", solution: `int Fib(int n) => n < 2 ? n : Fib(n - 1) + Fib(n - 2);
Console.WriteLine(Fib(6));` }
        ]
      },
      {
        id: "cs-enum", title: "Перечисления (enum)", duration: "16 мин",
        theory: `
          <h3>enum</h3>
          <p><strong>Перечисление</strong> — набор именованных констант. Делает код читаемее, чем «магические числа».</p>
        `,
        example: { lang: "csharp", note: "enum статуса заказа.",
          code: `enum OrderStatus { New, Paid, Shipped, Done }

OrderStatus status = OrderStatus.Paid;

if (status == OrderStatus.Paid)
    Console.WriteLine("Заказ оплачен");

Console.WriteLine((int)status); // 1 — числовое значение` },
        tasks: [
          { t: "Объяви enum", d: "easy", desc: "Создай enum Day с днями недели (хотя бы 3) и выведи один.", input: "—", output: "enum",
            hint: "enum Day { Mon, Tue, Wed }", solution: `enum Day { Mon, Tue, Wed }
Day d = Day.Tue;
Console.WriteLine(d);` },
          { t: "Число enum", d: "easy", desc: "Выведи числовое значение третьего элемента enum (индекс 2).", input: "—", output: "2",
            hint: "Приведи к (int).", solution: `enum Color { Red, Green, Blue }
Console.WriteLine((int)Color.Blue); // 2` }
        ]
      }
    ]
  }
];

/* ====== 3. Классы и ООП ====== */
CSHARP_MODULES.push({
  id: "cs-oop",
  icon: "🧱",
  title: "Классы и ООП",
  desc: "Классы, объекты, конструкторы, свойства, модификаторы доступа, static.",
  lessons: [
    {
      id: "cs-classes", title: "Классы и объекты", duration: "24 мин",
      theory: `
        <h3>Класс и объект</h3>
        <p><strong>Класс</strong> — шаблон (чертёж), <strong>объект</strong> — конкретный экземпляр класса. Класс содержит <strong>поля</strong> (данные) и <strong>методы</strong> (поведение).</p>
      `,
      example: { lang: "csharp", note: "Класс и создание объекта.",
        code: `class Person
{
    public string Name;
    public int Age;

    public void Hello()
    {
        Console.WriteLine("Привет, я " + Name);
    }
}

var p = new Person { Name = "Umar", Age = 20 };
p.Hello();` },
      tasks: [
        { t: "Создай класс", d: "easy", desc: "Опиши класс Car с полем Model и выведи его у объекта.", input: "—", output: "BMW",
          hint: "new Car { Model = \"BMW\" }", solution: `class Car { public string Model; }
var c = new Car { Model = "BMW" };
Console.WriteLine(c.Model);` },
        { t: "Метод объекта", d: "medium", desc: "Добавь в класс Dog метод Bark(), выводящий «Гав».", input: "—", output: "Гав",
          hint: "public void Bark()", solution: `class Dog { public void Bark() => Console.WriteLine("Гав"); }
new Dog().Bark();` }
      ]
    },
    {
      id: "cs-ctor", title: "Конструкторы и инициализаторы", duration: "22 мин",
      theory: `
        <h3>Конструктор</h3>
        <p><strong>Конструктор</strong> — особый метод, вызываемый при создании объекта (<code class="inline">new</code>). Имя совпадает с классом, типа возврата нет. Используется для инициализации.</p>
        <p><strong>Деконструктор</strong> (метод Deconstruct) позволяет «разложить» объект на переменные.</p>
      `,
      example: { lang: "csharp", note: "Конструктор с параметрами.",
        code: `class Product
{
    public string Name;
    public decimal Price;

    public Product(string name, decimal price)
    {
        Name = name;
        Price = price;
    }
}

var p = new Product("Телефон", 2500);
Console.WriteLine(p.Name + " - " + p.Price);` },
      tasks: [
        { t: "Конструктор", d: "easy", desc: "Добавь в класс User конструктор, принимающий имя.", input: "—", output: "конструктор",
          hint: "public User(string name) { Name = name; }", solution: `class User
{
    public string Name;
    public User(string name) { Name = name; }
}` },
        { t: "Два конструктора", d: "medium", desc: "Сделай класс Point с конструктором (x,y) и конструктором по умолчанию (0,0).", input: "—", output: "перегрузка",
          hint: "Можно вызвать один из другого через : this(...).", solution: `class Point
{
    public int X, Y;
    public Point() : this(0, 0) { }
    public Point(int x, int y) { X = x; Y = y; }
}` }
      ]
    },
    {
      id: "cs-struct", title: "Структуры, значимые и ссылочные типы", duration: "22 мин",
      theory: `
        <h3>struct vs class</h3>
        <ul>
          <li><strong>Класс</strong> — ссылочный тип (reference): переменная хранит ссылку, объект — в куче.</li>
          <li><strong>Структура</strong> — значимый тип (value): хранится по значению, копируется при передаче.</li>
        </ul>
        <p>Структуры подходят для маленьких неизменяемых данных (координаты, цвет).</p>
      `,
      example: { lang: "csharp", note: "Структура копируется, класс — по ссылке.",
        code: `struct PointS { public int X; }
class PointC { public int X; }

var s1 = new PointS { X = 1 };
var s2 = s1; s2.X = 99;      // копия
Console.WriteLine(s1.X);     // 1

var c1 = new PointC { X = 1 };
var c2 = c1; c2.X = 99;      // та же ссылка
Console.WriteLine(c1.X);     // 99` },
      tasks: [
        { t: "Объяви структуру", d: "easy", desc: "Создай struct Size с полями Width и Height.", input: "—", output: "struct",
          hint: "struct Size { public int Width, Height; }", solution: `struct Size { public int Width, Height; }` },
        { t: "Копия или ссылка?", d: "medium", desc: "Объясни в комментарии, почему изменение копии структуры не влияет на оригинал.", input: "—", output: "— (теория)",
          hint: "value type.", solution: `// Структура — значимый тип (value). При присваивании
// создаётся независимая КОПИЯ, поэтому оригинал не меняется.` }
      ]
    },
    {
      id: "cs-namespaces", title: "Пространства имён", duration: "16 мин",
      theory: `
        <h3>namespace</h3>
        <p><strong>Пространство имён</strong> группирует классы и предотвращает конфликты имён. Подключается через <code class="inline">using</code>.</p>
        <p>В новых версиях есть <strong>global using</strong> (подключение для всего проекта) и file-scoped namespace.</p>
      `,
      example: { lang: "csharp", note: "Объявление и использование пространства имён.",
        code: `namespace Shop.Models;   // file-scoped namespace

class Product
{
    public string Name = "";
}

// В другом файле:
// using Shop.Models;
// var p = new Product();` },
      tasks: [
        { t: "namespace", d: "easy", desc: "Объяви пространство имён MyApp.Services (file-scoped).", input: "—", output: "namespace",
          hint: "namespace MyApp.Services;", solution: `namespace MyApp.Services;` },
        { t: "using", d: "easy", desc: "Подключи пространство имён System.Text.", input: "—", output: "using",
          hint: "using ...;", solution: `using System.Text;` }
      ]
    },
    {
      id: "cs-access", title: "Модификаторы доступа", duration: "20 мин",
      theory: `
        <h3>Уровни доступа</h3>
        <ul>
          <li><strong>public</strong> — доступен отовсюду</li>
          <li><strong>private</strong> — только внутри класса (по умолчанию для членов)</li>
          <li><strong>protected</strong> — в классе и наследниках</li>
          <li><strong>internal</strong> — внутри сборки (проекта)</li>
          <li><strong>protected internal</strong> / <strong>private protected</strong> — комбинации</li>
        </ul>
        <div class="callout tip"><div class="c-ic">💡</div><div>Принцип инкапсуляции: делай поля <code class="inline">private</code>, а доступ — через <code class="inline">public</code> свойства.</div></div>
      `,
      example: { lang: "csharp", note: "Инкапсуляция: приватное поле + публичный доступ.",
        code: `class BankAccount
{
    private decimal _balance;        // скрыто

    public void Deposit(decimal sum) // публичный метод
    {
        if (sum > 0) _balance += sum;
    }

    public decimal GetBalance() => _balance;
}` },
      tasks: [
        { t: "private поле", d: "easy", desc: "Сделай поле _password приватным в классе User.", input: "—", output: "private",
          hint: "private string _password;", solution: `class User { private string _password; }` },
        { t: "Уровни доступа", d: "medium", desc: "Какой модификатор даёт доступ в классе и наследниках, но не снаружи?", input: "—", output: "protected",
          hint: "Не public и не private.", solution: `// protected — доступ внутри класса и его наследников.` }
      ]
    },
    {
      id: "cs-props", title: "Свойства (properties)", duration: "22 мин",
      theory: `
        <h3>Свойства</h3>
        <p><strong>Свойство</strong> — обёртка над полем с логикой чтения (<code class="inline">get</code>) и записи (<code class="inline">set</code>). Это способ безопасного доступа к данным.</p>
        <ul>
          <li>Авто-свойство: <code class="inline">public string Name { get; set; }</code></li>
          <li>Только для чтения: <code class="inline">{ get; }</code> или <code class="inline">{ get; init; }</code></li>
        </ul>
      `,
      example: { lang: "csharp", note: "Свойство с проверкой в set.",
        code: `class Person
{
    private int _age;
    public int Age
    {
        get => _age;
        set
        {
            if (value >= 0) _age = value; // value — присваиваемое значение
        }
    }
    public string Name { get; set; } = ""; // авто-свойство
}` },
      tasks: [
        { t: "Авто-свойство", d: "easy", desc: "Добавь в класс Book авто-свойство Title (string).", input: "—", output: "property",
          hint: "public string Title { get; set; }", solution: `class Book { public string Title { get; set; } = ""; }` },
        { t: "Валидация в set", d: "medium", desc: "Сделай свойство Price, которое не принимает отрицательные значения.", input: "—", output: "get/set",
          hint: "if (value >= 0) _price = value;", solution: `private decimal _price;
public decimal Price
{
    get => _price;
    set { if (value >= 0) _price = value; }
}` }
      ]
    },
    {
      id: "cs-overload", title: "Перегрузка методов", duration: "18 мин",
      theory: `
        <h3>Перегрузка</h3>
        <p><strong>Перегрузка</strong> — несколько методов с одним именем, но разными параметрами. Компилятор выбирает нужный по аргументам.</p>
      `,
      example: { lang: "csharp", note: "Три версии метода Print.",
        code: `void Print(int x) => Console.WriteLine("int: " + x);
void Print(string s) => Console.WriteLine("string: " + s);
void Print(int a, int b) => Console.WriteLine("sum: " + (a + b));

Print(5);
Print("hi");
Print(2, 3);` },
      tasks: [
        { t: "Перегрузи метод", d: "medium", desc: "Сделай два метода Area: для квадрата Area(int a) и прямоугольника Area(int a, int b).", input: "—", output: "overload",
          hint: "Разное число параметров.", solution: `int Area(int a) => a * a;
int Area(int a, int b) => a * b;` },
        { t: "Что решает выбор?", d: "easy", desc: "По чему компилятор выбирает нужную перегрузку?", input: "—", output: "по параметрам",
          hint: "Не по типу возврата.", solution: `// По количеству и типам аргументов (сигнатуре),
// но НЕ по типу возвращаемого значения.` }
      ]
    },
    {
      id: "cs-static", title: "Статические члены (static)", duration: "20 мин",
      theory: `
        <h3>static</h3>
        <p><strong>Статический</strong> член принадлежит классу, а не объекту. Доступ без создания экземпляра: <code class="inline">Math.PI</code>, <code class="inline">Console.WriteLine</code>.</p>
        <p>Статический класс нельзя инстанцировать — только утилиты (например, <code class="inline">Math</code>).</p>
      `,
      example: { lang: "csharp", note: "Статическое поле-счётчик и статический метод.",
        code: `class Counter
{
    public static int Count = 0;      // общий для всех
    public Counter() => Count++;

    public static int Square(int x) => x * x;
}

new Counter(); new Counter();
Console.WriteLine(Counter.Count);     // 2
Console.WriteLine(Counter.Square(5)); // 25` },
      tasks: [
        { t: "Статический метод", d: "easy", desc: "Напиши static-метод Max(int a, int b), возвращающий большее.", input: "3,7", output: "7",
          hint: "static int Max(...)", solution: `static int Max(int a, int b) => a > b ? a : b;
Console.WriteLine(Max(3, 7));` },
        { t: "Счётчик объектов", d: "medium", desc: "Сделай класс, считающий, сколько его объектов создано.", input: "—", output: "static поле",
          hint: "static поле++ в конструкторе.", solution: `class Item
{
    public static int Total = 0;
    public Item() => Total++;
}` }
      ]
    },
    {
      id: "cs-null", title: "Работа с null (?. и ??)", duration: "18 мин",
      theory: `
        <h3>null-безопасность</h3>
        <p><code class="inline">null</code> — отсутствие значения у ссылочного типа. Обращение к методу у null даёт <code class="inline">NullReferenceException</code>.</p>
        <ul>
          <li><code class="inline">?.</code> — безопасный доступ (вернёт null вместо падения)</li>
          <li><code class="inline">??</code> — значение по умолчанию, если null</li>
          <li><code class="inline">??=</code> — присвоить, если переменная null</li>
        </ul>
      `,
      example: { lang: "csharp", note: "Операторы ?. и ??",
        code: `string name = null;

int? len = name?.Length;        // null, без ошибки
string show = name ?? "Гость";  // "Гость"

name ??= "По умолчанию";        // присвоит, т.к. было null
Console.WriteLine(show + " " + name);` },
      tasks: [
        { t: "Оператор ??", d: "easy", desc: "Выведи переменную city, а если она null — слово «Город».", input: "city=null", output: "Город",
          hint: "city ?? \"Город\"", solution: `string city = null;
Console.WriteLine(city ?? "Город");` },
        { t: "Безопасный доступ", d: "medium", desc: "Безопасно получи длину строки s, которая может быть null (null если нет).", input: "s=null", output: "null",
          hint: "s?.Length", solution: `string s = null;
int? len = s?.Length;
Console.WriteLine(len);` }
      ]
    }
  ]
});

/* ====== 4. Наследование и полиморфизм ====== */
CSHARP_MODULES.push({
  id: "cs-inherit",
  icon: "🧬",
  title: "Наследование и полиморфизм",
  desc: "Наследование, виртуальные методы, абстрактные классы, System.Object.",
  lessons: [
    {
      id: "cs-inheritance", title: "Наследование", duration: "24 мин",
      theory: `
        <h3>Наследование</h3>
        <p>Класс-наследник получает поля и методы базового класса и может добавлять свои. Синтаксис: <code class="inline">class Dog : Animal</code>.</p>
        <p><code class="inline">base</code> — доступ к членам базового класса (например, вызвать его конструктор).</p>
      `,
      example: { lang: "csharp", note: "Наследник расширяет базовый класс.",
        code: `class Animal
{
    public string Name = "";
    public void Eat() => Console.WriteLine(Name + " ест");
}

class Dog : Animal
{
    public void Bark() => Console.WriteLine(Name + " лает");
}

var d = new Dog { Name = "Рекс" };
d.Eat();   // унаследовано
d.Bark();` },
      tasks: [
        { t: "Унаследуй класс", d: "easy", desc: "Сделай класс Student наследником Person.", input: "—", output: ": Person",
          hint: "class Student : Person", solution: `class Person { public string Name = ""; }
class Student : Person { public int Course; }` },
        { t: "base-конструктор", d: "medium", desc: "Вызови конструктор базового класса из наследника через base.", input: "—", output: "base(...)",
          hint: ": base(name)", solution: `class Animal { public Animal(string n) { } }
class Cat : Animal { public Cat(string n) : base(n) { } }` }
      ]
    },
    {
      id: "cs-virtual", title: "Виртуальные методы и полиморфизм", duration: "24 мин",
      theory: `
        <h3>Полиморфизm</h3>
        <p><strong>virtual</strong> в базовом классе + <strong>override</strong> в наследнике позволяют переопределить поведение. Это суть полиморфизма: один вызов — разное поведение в зависимости от типа объекта.</p>
        <p><strong>new</strong> — скрытие метода (не путать с override): прячет, но не переопределяет.</p>
      `,
      example: { lang: "csharp", note: "Переопределение метода.",
        code: `class Shape
{
    public virtual double Area() => 0;
}
class Circle : Shape
{
    public double R;
    public override double Area() => 3.14 * R * R;
}

Shape s = new Circle { R = 2 };
Console.WriteLine(s.Area()); // 12.56 — вызвался Circle.Area` },
      tasks: [
        { t: "override", d: "medium", desc: "Переопредели метод Sound() в классе Cat (базовый Animal возвращает «...»).", input: "—", output: "override",
          hint: "virtual в базе, override в наследнике.", solution: `class Animal { public virtual string Sound() => "..."; }
class Cat : Animal { public override string Sound() => "Мяу"; }` },
        { t: "override vs new", d: "easy", desc: "Чем override отличается от new при наследовании?", input: "—", output: "— (теория)",
          hint: "Полиморфизм.", solution: `// override ПЕРЕОПРЕДЕЛЯЕТ метод (полиморфизм: выбор по реальному типу).
// new СКРЫВАЕТ метод базового класса (выбор по типу переменной).` }
      ]
    },
    {
      id: "cs-abstract", title: "Абстрактные классы", duration: "20 мин",
      theory: `
        <h3>abstract</h3>
        <p><strong>Абстрактный класс</strong> нельзя создать через <code class="inline">new</code> — только наследовать. Может содержать <strong>абстрактные методы</strong> (без тела), которые наследник обязан реализовать.</p>
      `,
      example: { lang: "csharp", note: "Абстрактный класс и его реализация.",
        code: `abstract class Figure
{
    public abstract double Area();   // без реализации
    public void Describe() => Console.WriteLine("Площадь: " + Area());
}

class Square : Figure
{
    public double Side;
    public override double Area() => Side * Side;
}

new Square { Side = 4 }.Describe(); // 16` },
      tasks: [
        { t: "Абстрактный метод", d: "medium", desc: "Сделай абстрактный класс Payment с абстрактным методом Pay().", input: "—", output: "abstract",
          hint: "abstract class + abstract void Pay();", solution: `abstract class Payment
{
    public abstract void Pay(decimal sum);
}` },
        { t: "Почему abstract?", d: "easy", desc: "Можно ли создать объект абстрактного класса через new?", input: "—", output: "нет",
          hint: "Только наследовать.", solution: `// Нет. Абстрактный класс нельзя инстанцировать через new,
// его можно только наследовать и реализовать абстрактные члены.` }
      ]
    },
    {
      id: "cs-object", title: "Класс System.Object", duration: "18 мин",
      theory: `
        <h3>Базовый для всех</h3>
        <p>Все типы в C# наследуются от <code class="inline">object</code> (System.Object). Его методы: <code class="inline">ToString()</code>, <code class="inline">Equals()</code>, <code class="inline">GetHashCode()</code>, <code class="inline">GetType()</code>.</p>
        <p>Их часто переопределяют — например, <code class="inline">ToString()</code> для красивого вывода объекта.</p>
      `,
      example: { lang: "csharp", note: "Переопределение ToString.",
        code: `class Point
{
    public int X, Y;
    public override string ToString() => "(" + X + ", " + Y + ")";
}

var p = new Point { X = 1, Y = 2 };
Console.WriteLine(p); // (1, 2) — вызвался наш ToString` },
      tasks: [
        { t: "ToString", d: "easy", desc: "Переопредели ToString() класса User, чтобы выводил имя.", input: "—", output: "override",
          hint: "public override string ToString()", solution: `class User
{
    public string Name = "";
    public override string ToString() => Name;
}` },
        { t: "GetType", d: "easy", desc: "Выведи имя типа объекта obj.", input: "—", output: "тип",
          hint: "obj.GetType().Name", solution: `Console.WriteLine(obj.GetType().Name);` }
      ]
    }
  ]
});

/* ====== 5. Интерфейсы ====== */
CSHARP_MODULES.push({
  id: "cs-interfaces",
  icon: "🔌",
  title: "Интерфейсы",
  desc: "Контракты, реализация, IComparable, ICloneable.",
  lessons: [
    {
      id: "cs-interface-def", title: "Определение и реализация интерфейсов", duration: "24 мин",
      theory: `
        <h3>Интерфейс</h3>
        <p><strong>Интерфейс</strong> — контракт: список методов/свойств без реализации. Класс, реализующий интерфейс, обязан предоставить реализацию. Класс может реализовать <strong>несколько</strong> интерфейсов.</p>
        <p>По соглашению имена интерфейсов начинаются с <code class="inline">I</code>: <code class="inline">IComparable</code>, <code class="inline">IDisposable</code>.</p>
      `,
      example: { lang: "csharp", note: "Интерфейс и его реализация.",
        code: `interface IAnimal
{
    void Sound();
}

class Cat : IAnimal
{
    public void Sound() => Console.WriteLine("Мяу");
}

IAnimal a = new Cat();
a.Sound();` },
      tasks: [
        { t: "Реализуй интерфейс", d: "medium", desc: "Создай интерфейс IShape с методом Area() и реализуй в классе Circle.", input: "—", output: "интерфейс",
          hint: "class Circle : IShape", solution: `interface IShape { double Area(); }
class Circle : IShape
{
    public double R;
    public double Area() => 3.14 * R * R;
}` },
        { t: "Несколько интерфейсов", d: "easy", desc: "Сколько интерфейсов может реализовать один класс?", input: "—", output: "много",
          hint: "В отличие от наследования классов.", solution: `// Сколько угодно — класс может реализовать несколько интерфейсов,
// но наследоваться только от одного класса.` }
      ]
    },
    {
      id: "cs-icomparable", title: "IComparable и ICloneable", duration: "22 мин",
      theory: `
        <h3>Стандартные интерфейсы</h3>
        <ul>
          <li><strong>IComparable</strong> — сравнение объектов для сортировки (метод <code class="inline">CompareTo</code>).</li>
          <li><strong>ICloneable</strong> — копирование объекта (метод <code class="inline">Clone</code>).</li>
        </ul>
      `,
      example: { lang: "csharp", note: "Сортировка через IComparable.",
        code: `class Person : IComparable<Person>
{
    public string Name = "";
    public int Age;
    public int CompareTo(Person other) => Age.CompareTo(other.Age);
}

var people = new List<Person>
{
    new Person { Name = "Ali", Age = 30 },
    new Person { Name = "Vali", Age = 20 }
};
people.Sort(); // отсортируется по возрасту` },
      tasks: [
        { t: "CompareTo", d: "medium", desc: "Реализуй IComparable<Product> для сортировки по цене Price.", input: "—", output: "CompareTo",
          hint: "Price.CompareTo(other.Price)", solution: `class Product : IComparable<Product>
{
    public decimal Price;
    public int CompareTo(Product other) => Price.CompareTo(other.Price);
}` },
        { t: "Зачем IComparable?", d: "easy", desc: "Что даёт реализация IComparable?", input: "—", output: "сортировку",
          hint: "Sort().", solution: `// Позволяет сравнивать объекты и использовать стандартную
// сортировку (например, List.Sort() или Array.Sort()).` }
      ]
    }
  ]
});

/* ====== 6. Обобщения (Generics) ====== */
CSHARP_MODULES.push({
  id: "cs-generics",
  icon: "📐",
  title: "Обобщения (Generics)",
  desc: "Обобщённые типы и методы, ограничения, обобщённые интерфейсы.",
  lessons: [
    {
      id: "cs-generic-types", title: "Обобщённые типы и методы", duration: "24 мин",
      theory: `
        <h3>Generics</h3>
        <p><strong>Обобщения</strong> позволяют писать код, работающий с любым типом, сохраняя типобезопасность. Тип-параметр обозначают <code class="inline">T</code>.</p>
        <p>Примеры из .NET: <code class="inline">List&lt;T&gt;</code>, <code class="inline">Dictionary&lt;K,V&gt;</code>.</p>
      `,
      example: { lang: "csharp", note: "Обобщённый класс и метод.",
        code: `class Box<T>
{
    public T Value;
}

T Max<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) > 0 ? a : b;

var box = new Box<int> { Value = 5 };
Console.WriteLine(Max(3, 9)); // 9
Console.WriteLine(Max("a", "b")); // b` },
      tasks: [
        { t: "Обобщённый класс", d: "medium", desc: "Создай обобщённый класс Pair<T> с двумя полями First и Second.", input: "—", output: "generic",
          hint: "class Pair<T> { public T First, Second; }", solution: `class Pair<T>
{
    public T First;
    public T Second;
}` },
        { t: "Обобщённый метод", d: "medium", desc: "Напиши метод, который меняет местами два значения через ref (generic).", input: "—", output: "Swap<T>",
          hint: "void Swap<T>(ref T a, ref T b)", solution: `void Swap<T>(ref T a, ref T b)
{
    T tmp = a; a = b; b = tmp;
}` }
      ]
    },
    {
      id: "cs-constraints", title: "Ограничения обобщений", duration: "18 мин",
      theory: `
        <h3>where-ограничения</h3>
        <p>Ограничения сужают допустимые типы:</p>
        <ul>
          <li><code class="inline">where T : class</code> — только ссылочные</li>
          <li><code class="inline">where T : struct</code> — только значимые</li>
          <li><code class="inline">where T : new()</code> — есть конструктор без параметров</li>
          <li><code class="inline">where T : IComparable&lt;T&gt;</code> — реализует интерфейс</li>
        </ul>
      `,
      example: { lang: "csharp", note: "Ограничение на интерфейс.",
        code: `T Min<T>(T a, T b) where T : IComparable<T>
    => a.CompareTo(b) < 0 ? a : b;

Console.WriteLine(Min(10, 4)); // 4` },
      tasks: [
        { t: "Ограничение new()", d: "medium", desc: "Напиши метод Create<T>(), создающий новый объект T (нужно ограничение new()).", input: "—", output: "where T : new()",
          hint: "return new T();", solution: `T Create<T>() where T : new() => new T();` },
        { t: "Выбор ограничения", d: "easy", desc: "Какое ограничение разрешит только ссылочные типы?", input: "—", output: "where T : class",
          hint: "class или struct.", solution: `// where T : class` }
      ]
    }
  ]
});

/* ====== 7. Делегаты, лямбды, события ====== */
CSHARP_MODULES.push({
  id: "cs-delegates",
  icon: "⚡",
  title: "Делегаты, лямбды и события",
  desc: "Делегаты, анонимные методы, лямбды, Func/Action/Predicate, события.",
  lessons: [
    {
      id: "cs-delegate", title: "Делегаты и лямбды", duration: "24 мин",
      theory: `
        <h3>Делегат</h3>
        <p><strong>Делегат</strong> — тип, ссылающийся на метод. Позволяет передавать методы как аргументы (callback).</p>
        <p><strong>Лямбда</strong> — короткая анонимная функция: <code class="inline">x => x * 2</code>.</p>
      `,
      example: { lang: "csharp", note: "Делегат и лямбда.",
        code: `Func<int, int> square = x => x * x;          // принимает int, возвращает int
Action<string> greet = name => Console.WriteLine("Привет, " + name);

Console.WriteLine(square(5)); // 25
greet("Umar");` },
      tasks: [
        { t: "Лямбда", d: "easy", desc: "Создай Func<int,int,int>, возвращающий сумму двух чисел, и вызови с 2 и 3.", input: "—", output: "5",
          hint: "(a, b) => a + b", solution: `Func<int, int, int> add = (a, b) => a + b;
Console.WriteLine(add(2, 3));` },
        { t: "Action", d: "easy", desc: "Создай Action<string>, печатающий переданную строку в верхнем регистре.", input: "\"hi\"", output: "HI",
          hint: "s => Console.WriteLine(s.ToUpper())", solution: `Action<string> print = s => Console.WriteLine(s.ToUpper());
print("hi");` }
      ]
    },
    {
      id: "cs-funcs", title: "Func, Action, Predicate", duration: "18 мин",
      theory: `
        <h3>Встроенные делегаты</h3>
        <ul>
          <li><strong>Func&lt;..., TResult&gt;</strong> — возвращает значение</li>
          <li><strong>Action&lt;...&gt;</strong> — ничего не возвращает (void)</li>
          <li><strong>Predicate&lt;T&gt;</strong> — возвращает bool (условие)</li>
        </ul>
      `,
      example: { lang: "csharp", note: "Predicate для фильтра.",
        code: `Predicate<int> isEven = x => x % 2 == 0;
Console.WriteLine(isEven(4)); // True

var nums = new List<int> { 1, 2, 3, 4 };
var evens = nums.FindAll(isEven); // [2, 4]` },
      tasks: [
        { t: "Predicate", d: "medium", desc: "Создай Predicate<int>, проверяющий, что число больше 100.", input: "150", output: "True",
          hint: "x => x > 100", solution: `Predicate<int> big = x => x > 100;
Console.WriteLine(big(150));` },
        { t: "Func vs Action", d: "easy", desc: "Чем Func отличается от Action?", input: "—", output: "возврат",
          hint: "Одно возвращает значение.", solution: `// Func возвращает значение (последний тип-параметр — результат).
// Action ничего не возвращает (void).` }
      ]
    },
    {
      id: "cs-events", title: "События (events)", duration: "22 мин",
      theory: `
        <h3>event</h3>
        <p><strong>Событие</strong> — механизм уведомления подписчиков. Объект-издатель вызывает событие, подписчики реагируют. Основа паттерна «издатель-подписчик».</p>
      `,
      example: { lang: "csharp", note: "Событие и подписка.",
        code: `class Button
{
    public event Action Clicked;
    public void Press() => Clicked?.Invoke();
}

var btn = new Button();
btn.Clicked += () => Console.WriteLine("Нажато!");
btn.Press(); // -> Нажато!` },
      tasks: [
        { t: "Объяви событие", d: "medium", desc: "Добавь в класс Timer событие Tick типа Action.", input: "—", output: "event",
          hint: "public event Action Tick;", solution: `class Timer { public event Action Tick; }` },
        { t: "Подписка", d: "easy", desc: "Подпишись на событие Tick, чтобы печатать «tick».", input: "—", output: "+=",
          hint: "timer.Tick += () => ...", solution: `timer.Tick += () => Console.WriteLine("tick");` }
      ]
    }
  ]
});

/* ====== 8. Исключения ====== */
CSHARP_MODULES.push({
  id: "cs-exceptions",
  icon: "🧯",
  title: "Обработка исключений",
  desc: "try/catch/finally, типы исключений, throw, свои исключения.",
  lessons: [
    {
      id: "cs-trycatch", title: "try, catch, finally", duration: "22 мин",
      theory: `
        <h3>Обработка ошибок</h3>
        <p><strong>Исключение</strong> — ошибка во время выполнения. <code class="inline">try</code> — опасный код, <code class="inline">catch</code> — обработка, <code class="inline">finally</code> — выполнится всегда (очистка ресурсов).</p>
      `,
      example: { lang: "csharp", note: "Деление с обработкой ошибки.",
        code: `try
{
    int a = 10, b = 0;
    int c = a / b;            // DivideByZeroException
}
catch (DivideByZeroException ex)
{
    Console.WriteLine("Ошибка: " + ex.Message);
}
finally
{
    Console.WriteLine("Готово");
}` },
      tasks: [
        { t: "Обработай ошибку", d: "medium", desc: "Оберни int.Parse(\"abc\") в try/catch (FormatException).", input: "—", output: "обработка",
          hint: "catch (FormatException ex)", solution: `try
{
    int x = int.Parse("abc");
}
catch (FormatException ex)
{
    Console.WriteLine("Не число: " + ex.Message);
}` },
        { t: "finally", d: "easy", desc: "Когда выполняется блок finally?", input: "—", output: "всегда",
          hint: "С ошибкой или без.", solution: `// finally выполняется ВСЕГДА — была ошибка или нет.
// Используется для освобождения ресурсов.` }
      ]
    },
    {
      id: "cs-throw", title: "throw и свои исключения", duration: "20 мин",
      theory: `
        <h3>Генерация исключений</h3>
        <p><code class="inline">throw</code> выбрасывает исключение. Можно создавать свои классы исключений, наследуясь от <code class="inline">Exception</code>.</p>
      `,
      example: { lang: "csharp", note: "Своё исключение и throw.",
        code: `class NotEnoughMoneyException : Exception
{
    public NotEnoughMoneyException(string msg) : base(msg) { }
}

void Withdraw(decimal balance, decimal sum)
{
    if (sum > balance)
        throw new NotEnoughMoneyException("Недостаточно средств");
}` },
      tasks: [
        { t: "throw", d: "medium", desc: "Выбрось ArgumentException, если возраст отрицательный.", input: "age=-1", output: "throw",
          hint: "throw new ArgumentException(...)", solution: `if (age < 0)
    throw new ArgumentException("Возраст не может быть отрицательным");` },
        { t: "Своё исключение", d: "medium", desc: "Создай класс исключения EmptyCartException, наследник Exception.", input: "—", output: "class : Exception",
          hint: "Передай сообщение через base.", solution: `class EmptyCartException : Exception
{
    public EmptyCartException(string msg) : base(msg) { }
}` }
      ]
    }
  ]
});

/* ====== 9. Продвинутые типы ====== */
CSHARP_MODULES.push({
  id: "cs-types-extra",
  icon: "🧩",
  title: "Продвинутые возможности типов",
  desc: "Records, кортежи, индексаторы, расширения, паттерны сопоставления.",
  lessons: [
    {
      id: "cs-records", title: "Records и кортежи", duration: "22 мин",
      theory: `
        <h3>record и кортежи</h3>
        <p><strong>record</strong> — ссылочный тип с автоматическим сравнением по значению и кратким синтаксисом. Удобен для неизменяемых моделей (DTO).</p>
        <p><strong>Кортеж</strong> (tuple) — набор значений без создания класса: <code class="inline">(int, string)</code>.</p>
      `,
      example: { lang: "csharp", note: "record и кортеж.",
        code: `record Person(string Name, int Age);

var p1 = new Person("Ali", 20);
var p2 = new Person("Ali", 20);
Console.WriteLine(p1 == p2); // True — сравнение по значению

(string name, int age) info = ("Umar", 22);
Console.WriteLine(info.name + " " + info.age);` },
      tasks: [
        { t: "record", d: "easy", desc: "Объяви record Product с полями Name и Price.", input: "—", output: "record",
          hint: "record Product(string Name, decimal Price);", solution: `record Product(string Name, decimal Price);` },
        { t: "Кортеж", d: "medium", desc: "Напиши метод, возвращающий кортеж (min, max) массива.", input: "—", output: "(int,int)",
          hint: "return (min, max);", solution: `(int min, int max) MinMax(int[] a)
{
    int mn = a[0], mx = a[0];
    foreach (int x in a) { if (x < mn) mn = x; if (x > mx) mx = x; }
    return (mn, mx);
}` }
      ]
    },
    {
      id: "cs-patterns", title: "Паттерны сопоставления (pattern matching)", duration: "24 мин",
      theory: `
        <h3>Сопоставление с образцом</h3>
        <p>Паттерны упрощают проверки типов и значений в <code class="inline">switch</code> и <code class="inline">is</code>:</p>
        <ul>
          <li>Паттерн типа: <code class="inline">obj is string s</code></li>
          <li>Реляционный: <code class="inline">&gt;= 90</code></li>
          <li>Логический: <code class="inline">and</code>, <code class="inline">or</code>, <code class="inline">not</code></li>
          <li>Паттерн свойств: <code class="inline">{ Age: &gt; 18 }</code></li>
        </ul>
      `,
      example: { lang: "csharp", note: "switch с паттернами.",
        code: `string Describe(object obj) => obj switch
{
    int n when n < 0 => "отрицательное число",
    int n => "число " + n,
    string s => "строка длиной " + s.Length,
    null => "ничего",
    _ => "неизвестно"
};

Console.WriteLine(Describe(5));
Console.WriteLine(Describe("hi"));` },
      tasks: [
        { t: "Паттерн типа", d: "medium", desc: "С помощью is проверь, что obj — строка, и выведи её длину.", input: "—", output: "is string s",
          hint: "if (obj is string s)", solution: `if (obj is string s)
    Console.WriteLine(s.Length);` },
        { t: "Реляционный паттерн", d: "medium", desc: "Через switch верни оценку: >=90 A, >=70 B, иначе C.", input: "85", output: "B",
          hint: ">= 90 => \"A\"", solution: `string g = score switch
{
    >= 90 => "A",
    >= 70 => "B",
    _ => "C"
};` }
      ]
    },
    {
      id: "cs-indexers", title: "Индексаторы и расширения", duration: "20 мин",
      theory: `
        <h3>Индексаторы и методы расширения</h3>
        <p><strong>Индексатор</strong> позволяет обращаться к объекту как к массиву: <code class="inline">obj[i]</code>.</p>
        <p><strong>Метод расширения</strong> добавляет метод к существующему типу без его изменения (static-метод с <code class="inline">this</code> в первом параметре).</p>
      `,
      example: { lang: "csharp", note: "Метод расширения для string.",
        code: `static class StringExtensions
{
    public static bool IsEmail(this string s) => s.Contains("@");
}

// Использование:
Console.WriteLine("a@b.com".IsEmail()); // True` },
      tasks: [
        { t: "Метод расширения", d: "medium", desc: "Напиши расширение для int, возвращающее квадрат числа (Square()).", input: "5", output: "25",
          hint: "public static int Square(this int x)", solution: `static class IntExt
{
    public static int Square(this int x) => x * x;
}
// 5.Square() == 25` },
        { t: "Зачем расширения?", d: "easy", desc: "Что дают методы расширения?", input: "—", output: "— (теория)",
          hint: "Добавить метод без изменения типа.", solution: `// Позволяют добавлять методы к существующим типам (даже чужим),
// не изменяя их исходный код и не наследуясь.` }
      ]
    }
  ]
});

/* ====== 10. Коллекции ====== */
CSHARP_MODULES.push({
  id: "cs-collections",
  icon: "🗂️",
  title: "Коллекции",
  desc: "List, Dictionary, Queue, Stack, IEnumerable и итераторы (yield).",
  lessons: [
    {
      id: "cs-list", title: "Список List<T>", duration: "22 мин",
      theory: `
        <h3>List&lt;T&gt;</h3>
        <p><strong>List</strong> — динамический массив: размер меняется автоматически. Главные методы: <code class="inline">Add</code>, <code class="inline">Remove</code>, <code class="inline">Contains</code>, <code class="inline">Count</code>, индексатор <code class="inline">[i]</code>.</p>
      `,
      example: { lang: "csharp", note: "Работа со списком.",
        code: `var names = new List<string>();
names.Add("Ali");
names.Add("Vali");
names.Remove("Ali");

Console.WriteLine(names.Count);      // 1
Console.WriteLine(names.Contains("Vali")); // True
foreach (var n in names) Console.WriteLine(n);` },
      tasks: [
        { t: "Добавь элементы", d: "easy", desc: "Создай List<int>, добавь 1,2,3 и выведи количество.", input: "—", output: "3",
          hint: "list.Add(...), list.Count", solution: `var nums = new List<int> { 1, 2, 3 };
Console.WriteLine(nums.Count);` },
        { t: "Удаление", d: "medium", desc: "Удали из списка { 10, 20, 30 } число 20 и выведи оставшиеся.", input: "—", output: "10 30",
          hint: "list.Remove(20)", solution: `var l = new List<int> { 10, 20, 30 };
l.Remove(20);
Console.WriteLine(string.Join(" ", l));` }
      ]
    },
    {
      id: "cs-dictionary", title: "Словарь Dictionary<K,V>", duration: "22 мин",
      theory: `
        <h3>Dictionary</h3>
        <p><strong>Словарь</strong> хранит пары «ключ-значение». Быстрый поиск по ключу. Ключи уникальны.</p>
      `,
      example: { lang: "csharp", note: "Телефонная книга.",
        code: `var phones = new Dictionary<string, string>();
phones["Ali"] = "900-11-22";
phones["Vali"] = "900-33-44";

Console.WriteLine(phones["Ali"]);

if (phones.TryGetValue("Vali", out var num))
    Console.WriteLine(num);` },
      tasks: [
        { t: "Создай словарь", d: "medium", desc: "Создай Dictionary<string,int> возрастов и выведи возраст \"Umar\".", input: "—", output: "возраст",
          hint: "dict[\"Umar\"] = 20;", solution: `var ages = new Dictionary<string, int> { ["Umar"] = 20 };
Console.WriteLine(ages["Umar"]);` },
        { t: "Безопасный доступ", d: "medium", desc: "С помощью TryGetValue получи значение по ключу \"x\" (если нет — 0).", input: "—", output: "TryGetValue",
          hint: "dict.TryGetValue(\"x\", out var v)", solution: `int v = dict.TryGetValue("x", out var val) ? val : 0;` }
      ]
    },
    {
      id: "cs-queue-stack", title: "Очередь, стек, итераторы (yield)", duration: "22 мин",
      theory: `
        <h3>Queue, Stack и yield</h3>
        <ul>
          <li><strong>Queue&lt;T&gt;</strong> — очередь, FIFO (первый вошёл — первый вышел): Enqueue/Dequeue.</li>
          <li><strong>Stack&lt;T&gt;</strong> — стек, LIFO (последний вошёл — первый вышел): Push/Pop.</li>
          <li><strong>yield return</strong> — ленивая генерация последовательности (итератор).</li>
        </ul>
      `,
      example: { lang: "csharp", note: "Стек, очередь и итератор.",
        code: `var stack = new Stack<int>();
stack.Push(1); stack.Push(2);
Console.WriteLine(stack.Pop()); // 2 (LIFO)

IEnumerable<int> Evens(int max)
{
    for (int i = 0; i <= max; i += 2)
        yield return i;    // по одному, лениво
}
foreach (int e in Evens(6)) Console.Write(e + " "); // 0 2 4 6` },
      tasks: [
        { t: "Очередь", d: "medium", desc: "Добавь в Queue<string> \"a\",\"b\" и извлеки первый (Dequeue).", input: "—", output: "a",
          hint: "Enqueue + Dequeue", solution: `var q = new Queue<string>();
q.Enqueue("a"); q.Enqueue("b");
Console.WriteLine(q.Dequeue()); // a` },
        { t: "yield", d: "hard", desc: "Напиши итератор, возвращающий квадраты чисел 1..n через yield.", input: "n=3", output: "1 4 9",
          hint: "yield return i*i;", solution: `IEnumerable<int> Squares(int n)
{
    for (int i = 1; i <= n; i++) yield return i * i;
}` }
      ]
    }
  ]
});

/* ====== 11. Строки, дата и время ====== */
CSHARP_MODULES.push({
  id: "cs-strings",
  icon: "✍️",
  title: "Строки, дата и время",
  desc: "String, StringBuilder, интерполяция, регулярные выражения, DateTime.",
  lessons: [
    {
      id: "cs-string", title: "Строки и операции", duration: "22 мин",
      theory: `
        <h3>Строки</h3>
        <p>Строка (<code class="inline">string</code>) неизменяема. Полезные методы: <code class="inline">Length</code>, <code class="inline">ToUpper/ToLower</code>, <code class="inline">Substring</code>, <code class="inline">Contains</code>, <code class="inline">Replace</code>, <code class="inline">Split</code>, <code class="inline">Trim</code>.</p>
        <h4>Интерполяция</h4>
        <p><code class="inline">$"Привет, {name}!"</code> — вставка значений прямо в строку.</p>
      `,
      example: { lang: "csharp", note: "Операции со строками и интерполяция.",
        code: `string s = "  Hello World  ";
Console.WriteLine(s.Trim().ToUpper());        // HELLO WORLD
Console.WriteLine(s.Contains("World"));       // True

string name = "Umar";
int age = 20;
Console.WriteLine($"Меня зовут {name}, мне {age}");` },
      tasks: [
        { t: "Верхний регистр", d: "easy", desc: "Переведи строку \"dushanbe\" в верхний регистр.", input: "—", output: "DUSHANBE",
          hint: ".ToUpper()", solution: `Console.WriteLine("dushanbe".ToUpper());` },
        { t: "Split", d: "medium", desc: "Разбей строку \"a,b,c\" по запятой и выведи количество частей.", input: "—", output: "3",
          hint: ".Split(',')", solution: `var parts = "a,b,c".Split(',');
Console.WriteLine(parts.Length);` }
      ]
    },
    {
      id: "cs-stringbuilder", title: "StringBuilder и регулярки", duration: "20 мин",
      theory: `
        <h3>StringBuilder</h3>
        <p>Для множественного изменения строк в цикле используют <code class="inline">StringBuilder</code> — он эффективнее, чем склейка через <code class="inline">+</code>.</p>
        <h4>Регулярные выражения</h4>
        <p><code class="inline">Regex</code> проверяет и ищет шаблоны в тексте.</p>
      `,
      example: { lang: "csharp", note: "StringBuilder и проверка email.",
        code: `var sb = new System.Text.StringBuilder();
for (int i = 0; i < 3; i++) sb.Append("ab");
Console.WriteLine(sb.ToString()); // ababab

bool isEmail = System.Text.RegularExpressions.Regex
    .IsMatch("a@b.com", @"^\S+@\S+\.\S+$");
Console.WriteLine(isEmail); // True` },
      tasks: [
        { t: "StringBuilder", d: "medium", desc: "С помощью StringBuilder собери строку \"12345\" из цифр в цикле.", input: "—", output: "12345",
          hint: "sb.Append(i)", solution: `var sb = new System.Text.StringBuilder();
for (int i = 1; i <= 5; i++) sb.Append(i);
Console.WriteLine(sb);` },
        { t: "Зачем StringBuilder?", d: "easy", desc: "Почему StringBuilder лучше + в цикле?", input: "—", output: "— (теория)",
          hint: "Строки неизменяемы.", solution: `// Строки неизменяемы: каждое + создаёт НОВУЮ строку.
// StringBuilder меняет один буфер — быстрее и экономнее по памяти.` }
      ]
    },
    {
      id: "cs-datetime", title: "DateTime и время", duration: "18 мин",
      theory: `
        <h3>Дата и время</h3>
        <p><code class="inline">DateTime</code> хранит дату и время. <code class="inline">DateTime.Now</code> — текущий момент. Можно складывать интервалы (<code class="inline">AddDays</code>) и форматировать.</p>
      `,
      example: { lang: "csharp", note: "Работа с датами.",
        code: `DateTime now = DateTime.Now;
DateTime tomorrow = now.AddDays(1);

Console.WriteLine(now.ToString("dd.MM.yyyy"));
Console.WriteLine(tomorrow.DayOfWeek);

TimeSpan diff = tomorrow - now;
Console.WriteLine(diff.TotalHours); // 24` },
      tasks: [
        { t: "Через неделю", d: "medium", desc: "Выведи дату, которая наступит через 7 дней от сегодня.", input: "—", output: "дата",
          hint: "DateTime.Now.AddDays(7)", solution: `Console.WriteLine(DateTime.Now.AddDays(7).ToString("dd.MM.yyyy"));` },
        { t: "Формат даты", d: "easy", desc: "Отформатируй текущую дату как \"yyyy-MM-dd\".", input: "—", output: "2026-11-02",
          hint: ".ToString(\"yyyy-MM-dd\")", solution: `Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd"));` }
      ]
    }
  ]
});

/* ====== 12. Многопоточность и async ====== */
CSHARP_MODULES.push({
  id: "cs-threading",
  icon: "🧵",
  title: "Многопоточность и async",
  desc: "Thread, синхронизация, Task, Parallel, async/await.",
  lessons: [
    {
      id: "cs-thread", title: "Потоки и синхронизация", duration: "24 мин",
      theory: `
        <h3>Thread</h3>
        <p><strong>Поток</strong> выполняет код параллельно. Когда несколько потоков меняют общие данные — нужна <strong>синхронизация</strong> (<code class="inline">lock</code>), иначе гонки данных.</p>
      `,
      example: { lang: "csharp", note: "Поток и блокировка lock.",
        code: `object locker = new object();
int counter = 0;

void Increment()
{
    lock (locker)      // только один поток за раз
    {
        counter++;
    }
}

var t = new Thread(Increment);
t.Start();
t.Join(); // дождаться завершения` },
      tasks: [
        { t: "Запусти поток", d: "medium", desc: "Создай и запусти Thread, выполняющий метод Work.", input: "—", output: "Thread",
          hint: "new Thread(Work).Start()", solution: `void Work() => Console.WriteLine("Работаю");
var t = new Thread(Work);
t.Start();` },
        { t: "Зачем lock?", d: "easy", desc: "Что защищает оператор lock?", input: "—", output: "— (теория)",
          hint: "Общие данные.", solution: `// lock защищает общие данные от одновременного доступа
// нескольких потоков (гонок данных), пропуская по одному потоку.` }
      ]
    },
    {
      id: "cs-task", title: "Task, Parallel и async/await", duration: "26 мин",
      theory: `
        <h3>Task и async</h3>
        <p><strong>Task</strong> — асинхронная операция. <code class="inline">async/await</code> позволяет ждать результат, не блокируя поток. <code class="inline">Parallel.For</code> — для параллельных вычислений.</p>
        <p><code class="inline">Task.WhenAll</code> запускает задачи одновременно и ждёт все.</p>
      `,
      example: { lang: "csharp", note: "Асинхронный метод и параллельные задачи.",
        code: `async Task<int> GetDataAsync()
{
    await Task.Delay(500);   // не блокирует поток
    return 42;
}

int result = await GetDataAsync();

var all = await Task.WhenAll(GetDataAsync(), GetDataAsync());
Console.WriteLine(all[0] + all[1]); // 84` },
      tasks: [
        { t: "async-метод", d: "medium", desc: "Напиши async Task<string>, который после Task.Delay возвращает \"ok\".", input: "—", output: "ok",
          hint: "await Task.Delay(...); return \"ok\";", solution: `async Task<string> LoadAsync()
{
    await Task.Delay(100);
    return "ok";
}` },
        { t: "WhenAll", d: "medium", desc: "Запусти две задачи параллельно и дождись обеих через Task.WhenAll.", input: "—", output: "WhenAll",
          hint: "await Task.WhenAll(t1, t2)", solution: `await Task.WhenAll(GetDataAsync(), GetDataAsync());` }
      ]
    }
  ]
});

/* ====== 13. LINQ ====== */
CSHARP_MODULES.push({
  id: "cs-linq-full",
  icon: "🔎",
  title: "LINQ",
  desc: "Фильтрация, сортировка, проекция, группировка, агрегация коллекций.",
  lessons: [
    {
      id: "cs-linq-basics", title: "Основы LINQ: Where, Select, OrderBy", duration: "26 мин",
      theory: `
        <h3>LINQ</h3>
        <p><strong>LINQ</strong> — единый способ запросов к коллекциям. Операторы: <code class="inline">Where</code> (фильтр), <code class="inline">Select</code> (проекция), <code class="inline">OrderBy</code> (сортировка).</p>
      `,
      example: { lang: "csharp", note: "Цепочка LINQ.",
        code: `int[] nums = { 5, 2, 8, 1, 9, 4 };

var result = nums
    .Where(n => n > 3)
    .OrderBy(n => n)
    .Select(n => n * 10)
    .ToList(); // [40, 50, 80, 90]` },
      tasks: [
        { t: "Фильтр", d: "easy", desc: "Выбери из { 1,2,3,4,5,6 } только чётные.", input: "—", output: "2 4 6",
          hint: ".Where(n => n % 2 == 0)", solution: `var evens = new[] { 1,2,3,4,5,6 }.Where(n => n % 2 == 0).ToList();` },
        { t: "Проекция", d: "medium", desc: "Из списка слов сделай список их длин.", input: "[\"a\",\"bb\"]", output: "[1,2]",
          hint: ".Select(w => w.Length)", solution: `var lens = words.Select(w => w.Length).ToList();` }
      ]
    },
    {
      id: "cs-linq-agg", title: "Группировка и агрегация", duration: "24 мин",
      theory: `
        <h3>GroupBy и агрегаты</h3>
        <p>Агрегаты: <code class="inline">Count</code>, <code class="inline">Sum</code>, <code class="inline">Average</code>, <code class="inline">Min</code>, <code class="inline">Max</code>. <code class="inline">GroupBy</code> группирует по ключу.</p>
      `,
      example: { lang: "csharp", note: "Группировка и среднее.",
        code: `var nums = new[] { 1, 2, 3, 4, 5, 6 };

Console.WriteLine(nums.Sum());     // 21
Console.WriteLine(nums.Average()); // 3.5

var groups = nums.GroupBy(n => n % 2 == 0 ? "чёт" : "нечёт");
foreach (var g in groups)
    Console.WriteLine(g.Key + ": " + g.Count());` },
      tasks: [
        { t: "Сумма и максимум", d: "easy", desc: "Найди сумму и максимум массива { 3, 7, 2, 8 }.", input: "—", output: "20, 8",
          hint: ".Sum() и .Max()", solution: `var a = new[] { 3, 7, 2, 8 };
Console.WriteLine(a.Sum() + ", " + a.Max());` },
        { t: "Группировка", d: "hard", desc: "Сгруппируй числа 1..10 по чётности и выведи количество в каждой группе.", input: "—", output: "2 группы по 5",
          hint: "GroupBy(n => n % 2)", solution: `var groups = Enumerable.Range(1, 10)
    .GroupBy(n => n % 2)
    .Select(g => new { Key = g.Key, Count = g.Count() });` }
      ]
    }
  ]
});

/* ====== 14. Файлы, JSON и рефлексия ====== */
CSHARP_MODULES.push({
  id: "cs-io",
  icon: "💾",
  title: "Файлы, JSON и рефлексия",
  desc: "Чтение/запись файлов, сериализация в JSON, рефлексия и атрибуты.",
  lessons: [
    {
      id: "cs-files", title: "Работа с файлами", duration: "22 мин",
      theory: `
        <h3>Файлы</h3>
        <p>Класс <code class="inline">File</code> — простые операции: <code class="inline">WriteAllText</code>, <code class="inline">ReadAllText</code>, <code class="inline">AppendAllText</code>, <code class="inline">Exists</code>. Для потоков — <code class="inline">StreamReader/StreamWriter</code>.</p>
      `,
      example: { lang: "csharp", note: "Запись и чтение файла.",
        code: `File.WriteAllText("data.txt", "Привет, файл!");

if (File.Exists("data.txt"))
{
    string text = File.ReadAllText("data.txt");
    Console.WriteLine(text);
}

File.AppendAllText("data.txt", "\nНовая строка");` },
      tasks: [
        { t: "Запись", d: "easy", desc: "Запиши строку \"test\" в файл log.txt.", input: "—", output: "WriteAllText",
          hint: "File.WriteAllText(...)", solution: `File.WriteAllText("log.txt", "test");` },
        { t: "Чтение с проверкой", d: "medium", desc: "Прочитай файл config.txt, только если он существует.", input: "—", output: "ReadAllText",
          hint: "File.Exists перед чтением.", solution: `if (File.Exists("config.txt"))
    Console.WriteLine(File.ReadAllText("config.txt"));` }
      ]
    },
    {
      id: "cs-json", title: "Сериализация в JSON", duration: "20 мин",
      theory: `
        <h3>JSON</h3>
        <p><code class="inline">JsonSerializer</code> (из System.Text.Json) превращает объект в JSON-строку и обратно. Нужно для API и хранения данных.</p>
      `,
      example: { lang: "csharp", note: "Объект ↔ JSON.",
        code: `using System.Text.Json;

var person = new { Name = "Umar", Age = 20 };
string json = JsonSerializer.Serialize(person);
Console.WriteLine(json); // {"Name":"Umar","Age":20}

var back = JsonSerializer.Deserialize<Dictionary<string, object>>(json);` },
      tasks: [
        { t: "В JSON", d: "medium", desc: "Сериализуй объект { Id = 1, Name = \"Box\" } в JSON-строку.", input: "—", output: "JSON",
          hint: "JsonSerializer.Serialize(obj)", solution: `string json = JsonSerializer.Serialize(new { Id = 1, Name = "Box" });` },
        { t: "Из JSON", d: "medium", desc: "Десериализуй JSON-строку в объект Product.", input: "—", output: "Deserialize",
          hint: "JsonSerializer.Deserialize<Product>(json)", solution: `var p = JsonSerializer.Deserialize<Product>(json);` }
      ]
    },
    {
      id: "cs-reflection", title: "Рефлексия и атрибуты", duration: "20 мин",
      theory: `
        <h3>Рефлексия</h3>
        <p><strong>Рефлексия</strong> позволяет исследовать типы во время выполнения: получить список свойств, методов, атрибутов. Используется в ORM, сериализаторах, DI-контейнерах.</p>
        <p><strong>Атрибуты</strong> — метаданные, навешиваемые на классы и члены: <code class="inline">[Required]</code>, <code class="inline">[Obsolete]</code>.</p>
      `,
      example: { lang: "csharp", note: "Исследование типа через рефлексию.",
        code: `var type = typeof(string);
Console.WriteLine(type.Name); // String

foreach (var prop in typeof(DateTime).GetProperties())
    Console.WriteLine(prop.Name); // Year, Month, Day...` },
      tasks: [
        { t: "Имя типа", d: "easy", desc: "Выведи имя типа int через typeof и .Name.", input: "—", output: "Int32",
          hint: "typeof(int).Name", solution: `Console.WriteLine(typeof(int).Name); // Int32` },
        { t: "Свойства", d: "medium", desc: "Выведи имена всех свойств типа объекта obj через рефлексию.", input: "—", output: "свойства",
          hint: "obj.GetType().GetProperties()", solution: `foreach (var p in obj.GetType().GetProperties())
    Console.WriteLine(p.Name);` }
      ]
    }
  ]
});

/* ====== Merge C# modules BEFORE backend modules ====== */
COURSE.modules = CSHARP_MODULES.concat(COURSE.modules);

/* ====== Tests for key new modules ====== */
Object.assign(TESTS, {
  "cs-basics": [
    { q: "Что выведет var name = \"Ali\";?", options: ["Ошибку", "Переменную типа string", "int", "null"], correct: 1, explain: "var выводит тип автоматически — здесь string." },
    { q: "Какой оператор даёт остаток от деления?", options: ["/", "%", "*", "//"], correct: 1, explain: "% — остаток от деления." },
    { q: "Какой цикл гарантированно выполнится хотя бы раз?", options: ["for", "while", "do..while", "foreach"], correct: 2, explain: "do..while проверяет условие после тела." },
    { q: "С какого индекса начинаются массивы?", options: ["с 1", "с 0", "с -1", "с любого"], correct: 1, explain: "Индексация с нуля." }
  ],
  "cs-oop": [
    { q: "Что такое объект?", options: ["Шаблон", "Экземпляр класса", "Метод", "Переменная"], correct: 1, explain: "Объект — конкретный экземпляр класса." },
    { q: "Модификатор доступа по умолчанию для членов класса?", options: ["public", "private", "protected", "internal"], correct: 1, explain: "По умолчанию члены private." },
    { q: "Что инкапсулирует свойство?", options: ["Цикл", "Доступ к полю через get/set", "Массив", "Поток"], correct: 1, explain: "Свойство оборачивает поле логикой get/set." },
    { q: "static-член принадлежит...", options: ["объекту", "классу", "методу", "потоку"], correct: 1, explain: "Статический член принадлежит классу, не экземпляру." }
  ],
  "cs-inherit": [
    { q: "Чем override отличается от new?", options: ["Ничем", "override переопределяет (полиморфизм), new скрывает", "new быстрее", "override только для полей"], correct: 1, explain: "override — полиморфизм; new — скрытие." },
    { q: "Можно ли создать объект абстрактного класса?", options: ["Да", "Нет, только наследовать", "Только через static", "Только в Main"], correct: 1, explain: "Абстрактный класс нельзя инстанцировать." },
    { q: "От какого класса наследуются все типы?", options: ["Base", "System.Object", "Main", "Type"], correct: 1, explain: "Все типы наследуются от object (System.Object)." },
    { q: "Ключевое слово для доступа к базовому классу?", options: ["this", "base", "super", "parent"], correct: 1, explain: "base — доступ к членам базового класса." }
  ],
  "cs-collections": [
    { q: "Какая коллекция хранит пары ключ-значение?", options: ["List", "Dictionary", "Queue", "Stack"], correct: 1, explain: "Dictionary<K,V> хранит пары." },
    { q: "Stack работает по принципу...", options: ["FIFO", "LIFO", "случайно", "по индексу"], correct: 1, explain: "Stack — LIFO (последним вошёл, первым вышел)." },
    { q: "Что делает yield return?", options: ["Прерывает цикл", "Лениво возвращает элементы последовательности", "Бросает исключение", "Создаёт поток"], correct: 1, explain: "yield генерирует элементы по одному (ленивый итератор)." },
    { q: "Как узнать число элементов List?", options: [".Length", ".Count", ".Size()", ".Len"], correct: 1, explain: "У List — свойство Count." }
  ],
  "cs-linq-full": [
    { q: "Какой оператор LINQ фильтрует?", options: ["Select", "Where", "OrderBy", "GroupBy"], correct: 1, explain: "Where оставляет элементы по условию." },
    { q: "Что делает Select?", options: ["Сортирует", "Фильтрует", "Проецирует (преобразует) элементы", "Группирует"], correct: 2, explain: "Select преобразует каждый элемент." },
    { q: "Какой метод считает среднее?", options: ["Sum", "Count", "Average", "Max"], correct: 2, explain: "Average — среднее значение." },
    { q: "Что группирует элементы по ключу?", options: ["OrderBy", "GroupBy", "Where", "Take"], correct: 1, explain: "GroupBy группирует по ключу." }
  ],
  "cs-delegates": [
    { q: "Что такое делегат?", options: ["Переменная", "Тип-ссылка на метод", "Класс-коллекция", "Цикл"], correct: 1, explain: "Делегат ссылается на метод." },
    { q: "Func<int,int> что возвращает?", options: ["void", "int", "bool", "ничего"], correct: 1, explain: "Последний параметр Func — тип результата (int)." },
    { q: "Что такое лямбда?", options: ["Класс", "Короткая анонимная функция", "Поле", "Интерфейс"], correct: 1, explain: "Лямбда — анонимная функция вида x => ..." },
    { q: "Для чего нужны события (event)?", options: ["Хранить данные", "Уведомлять подписчиков", "Сортировать", "Читать файлы"], correct: 1, explain: "События уведомляют подписчиков (издатель-подписчик)." }
  ],
  "cs-threading": [
    { q: "Что защищает lock?", options: ["Файлы", "Общие данные от гонок потоков", "Память от утечек", "Сеть"], correct: 1, explain: "lock пропускает один поток за раз к общим данным." },
    { q: "Что делает await?", options: ["Блокирует поток", "Ждёт результат, не блокируя поток", "Создаёт поток", "Останавливает приложение"], correct: 1, explain: "await не блокирует поток во время ожидания." },
    { q: "Что запускает задачи параллельно и ждёт все?", options: ["Task.Delay", "Task.WhenAll", "Thread.Sleep", "lock"], correct: 1, explain: "Task.WhenAll ждёт завершения всех задач." }
  ]
});
