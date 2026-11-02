/* =========================================================
   SharpAcademy — course content
   Весь контент в одном объекте COURSE + INTERVIEW.
   theory: HTML-строка, example: {code, lang, note}, tasks: [...]
   ========================================================= */

const COURSE = {
  title: "Backend .NET разработчик",
  modules: [

    /* ============== MODULE 1: ADO.NET ============== */
    {
      id: "ado",
      icon: "🗄️",
      title: "Работа с данными — ADO.NET",
      desc: "Подключение к БД, CRUD, защита от SQL-инъекций, DataSet и DataAdapter.",
      lessons: [
        {
          id: "ado-basics",
          title: "Основы ADO.NET и подключение к БД",
          duration: "25 мин",
          theory: `
            <h3>Что такое ADO.NET</h3>
            <p><strong>ADO.NET</strong> — это набор классов .NET для работы с базами данных. Он позволяет подключаться к СУБД, отправлять SQL-запросы и читать/изменять данные.</p>
            <p>Для PostgreSQL используется драйвер <code class="inline">Npgsql</code>, для SQL Server — <code class="inline">Microsoft.Data.SqlClient</code>. Логика работы у них одинаковая.</p>
            <h4>Главные объекты ADO.NET</h4>
            <ul>
              <li><strong>Connection</strong> — соединение с базой (<code class="inline">NpgsqlConnection</code>)</li>
              <li><strong>Command</strong> — SQL-команда (<code class="inline">NpgsqlCommand</code>)</li>
              <li><strong>DataReader</strong> — быстрое чтение данных «вперёд» построчно</li>
              <li><strong>DataAdapter / DataSet</strong> — загрузка данных в память целиком</li>
            </ul>
            <div class="callout tip"><div class="c-ic">💡</div><div>Запомни порядок: <strong>открыть соединение → создать команду → выполнить → закрыть</strong>. Всё, что реализует <code class="inline">IDisposable</code>, оборачивай в <code class="inline">using</code>, чтобы соединение закрылось автоматически.</div></div>
            <h4>Строка подключения</h4>
            <p>Это адрес базы и данные для входа. Хранить её лучше в <code class="inline">appsettings.json</code>, а не прямо в коде.</p>
          `,
          example: {
            lang: "csharp",
            note: "Подключаемся к PostgreSQL и читаем всех студентов через DataReader.",
            code: `using Npgsql;

string connString = "Host=localhost;Port=5432;Database=school_db;Username=postgres;Password=12345";

// using закроет соединение автоматически
using var conn = new NpgsqlConnection(connString);
conn.Open();

string query = "SELECT id, name, age FROM students";
using var cmd = new NpgsqlCommand(query, conn);
using var reader = cmd.ExecuteReader();

while (reader.Read())
{
    int id = reader.GetInt32(0);
    string name = reader.GetString(1);
    int age = reader.GetInt32(2);
    Console.WriteLine(id + " - " + name + " - " + age);
}`
          },
          tasks: [
            { t: "Строка подключения", d: "easy",
              desc: "Создай строку подключения к базе <code class='inline'>shop_db</code> на localhost (порт 5432), пользователь postgres, пароль admin.",
              input: "—", output: 'Host=localhost;Port=5432;Database=shop_db;Username=postgres;Password=admin',
              hint: "Формат: Host=...;Port=...;Database=...;Username=...;Password=...",
              solution: `string connString =
    "Host=localhost;Port=5432;Database=shop_db;Username=postgres;Password=admin";` },
            { t: "Открыть соединение", d: "easy",
              desc: "Напиши код, который создаёт <code class='inline'>NpgsqlConnection</code>, открывает его и выводит в консоль «Подключение успешно».",
              input: "—", output: "Подключение успешно",
              hint: "Используй using var conn = new NpgsqlConnection(connString); conn.Open();",
              solution: `using var conn = new NpgsqlConnection(connString);
conn.Open();
Console.WriteLine("Подключение успешно");` },
            { t: "Чтение одной колонки", d: "medium",
              desc: "Выведи имена всех пользователей из таблицы <code class='inline'>users</code> (колонка <code class='inline'>name</code>).",
              input: "users: Ali, Vali, Guli", output: "Ali\nVali\nGuli",
              hint: "SELECT name FROM users; затем while(reader.Read()) и reader.GetString(0)",
              solution: `using var cmd = new NpgsqlCommand("SELECT name FROM users", conn);
using var reader = cmd.ExecuteReader();
while (reader.Read())
{
    Console.WriteLine(reader.GetString(0));
}` },
            { t: "Подсчёт строк", d: "medium",
              desc: "С помощью <code class='inline'>ExecuteScalar</code> выведи количество записей в таблице <code class='inline'>products</code>.",
              input: "products: 42 записи", output: "42",
              hint: "ExecuteScalar() возвращает object — приведи к int через Convert.ToInt32(...).",
              solution: `using var cmd = new NpgsqlCommand("SELECT COUNT(*) FROM products", conn);
int count = Convert.ToInt32(cmd.ExecuteScalar());
Console.WriteLine(count);` },
            { t: "Почему using?", d: "easy",
              desc: "Объясни в комментарии своими словами, зачем соединение оборачивают в <code class='inline'>using</code>.",
              input: "—", output: "— (теория)",
              hint: "Подумай про ресурсы и Dispose().",
              solution: `// using гарантирует вызов Dispose() и закрытие соединения
// даже если произойдёт исключение. Иначе соединение «зависнет»
// и пул соединений быстро закончится.` }
          ]
        },
        {
          id: "ado-crud",
          title: "CRUD через ADO.NET",
          duration: "30 мин",
          theory: `
            <h3>CRUD = Create, Read, Update, Delete</h3>
            <p>Четыре базовые операции с данными. В ADO.NET для изменения данных (INSERT, UPDATE, DELETE) используется метод <code class="inline">ExecuteNonQuery()</code> — он возвращает количество затронутых строк.</p>
            <h4>Какой метод когда</h4>
            <ul>
              <li><code class="inline">ExecuteReader()</code> — SELECT (много строк)</li>
              <li><code class="inline">ExecuteScalar()</code> — одно значение (COUNT, MAX, вернуть id)</li>
              <li><code class="inline">ExecuteNonQuery()</code> — INSERT / UPDATE / DELETE</li>
            </ul>
            <div class="callout warn"><div class="c-ic">⚠️</div><div>Никогда не склеивай значения в SQL через <code class="inline">+</code>. Это открывает SQL-инъекцию (следующий урок). Всегда используй <strong>параметры</strong>.</div></div>
          `,
          example: {
            lang: "csharp",
            note: "INSERT с параметрами и возврат нового id через RETURNING.",
            code: `// CREATE — добавляем студента и получаем его id
string sql = "INSERT INTO students (name, age) VALUES (@name, @age) RETURNING id";

using var cmd = new NpgsqlCommand(sql, conn);
cmd.Parameters.AddWithValue("name", "Umar");
cmd.Parameters.AddWithValue("age", 20);

int newId = Convert.ToInt32(cmd.ExecuteScalar());
Console.WriteLine("Создан студент с id = " + newId);

// UPDATE
using var upd = new NpgsqlCommand("UPDATE students SET age = @age WHERE id = @id", conn);
upd.Parameters.AddWithValue("age", 21);
upd.Parameters.AddWithValue("id", newId);
int affected = upd.ExecuteNonQuery();
Console.WriteLine("Обновлено строк: " + affected);`
          },
          tasks: [
            { t: "INSERT", d: "easy",
              desc: "Добавь в таблицу <code class='inline'>cities</code> город с именем @name. Используй параметр.",
              input: "name = Dushanbe", output: "Строк добавлено: 1",
              hint: "ExecuteNonQuery() вернёт число затронутых строк.",
              solution: `using var cmd = new NpgsqlCommand("INSERT INTO cities (name) VALUES (@name)", conn);
cmd.Parameters.AddWithValue("name", "Dushanbe");
int rows = cmd.ExecuteNonQuery();
Console.WriteLine("Строк добавлено: " + rows);` },
            { t: "UPDATE по id", d: "medium",
              desc: "Измени цену товара с id=5 на 999 в таблице <code class='inline'>products</code>.",
              input: "id=5, price=999", output: "Обновлено: 1",
              hint: "UPDATE products SET price=@p WHERE id=@id",
              solution: `using var cmd = new NpgsqlCommand("UPDATE products SET price=@p WHERE id=@id", conn);
cmd.Parameters.AddWithValue("p", 999);
cmd.Parameters.AddWithValue("id", 5);
Console.WriteLine("Обновлено: " + cmd.ExecuteNonQuery());` },
            { t: "DELETE", d: "medium",
              desc: "Удали из таблицы <code class='inline'>users</code> пользователя с id = @id.",
              input: "id=10", output: "Удалено: 1",
              hint: "DELETE FROM users WHERE id=@id",
              solution: `using var cmd = new NpgsqlCommand("DELETE FROM users WHERE id=@id", conn);
cmd.Parameters.AddWithValue("id", 10);
Console.WriteLine("Удалено: " + cmd.ExecuteNonQuery());` },
            { t: "Метод CRUD-репозитория", d: "hard",
              desc: "Напиши метод <code class='inline'>void AddProduct(string name, decimal price)</code>, который открывает соединение и вставляет товар.",
              input: "—", output: "— (метод)",
              hint: "Строку подключения передай/возьми из поля класса. Оберни connection в using внутри метода.",
              solution: `public void AddProduct(string name, decimal price)
{
    using var conn = new NpgsqlConnection(_connString);
    conn.Open();
    using var cmd = new NpgsqlCommand(
        "INSERT INTO products (name, price) VALUES (@n, @p)", conn);
    cmd.Parameters.AddWithValue("n", name);
    cmd.Parameters.AddWithValue("p", price);
    cmd.ExecuteNonQuery();
}` },
            { t: "Выбор метода", d: "easy",
              desc: "Какой метод использовать для запроса <code class='inline'>SELECT MAX(price) FROM products</code>? Напиши код.",
              input: "—", output: "ExecuteScalar",
              hint: "Возвращается одно значение.",
              solution: `using var cmd = new NpgsqlCommand("SELECT MAX(price) FROM products", conn);
var max = cmd.ExecuteScalar();
Console.WriteLine(max);` }
          ]
        },
        {
          id: "ado-sqli",
          title: "SQL-инъекции и параметры",
          duration: "20 мин",
          theory: `
            <h3>Что такое SQL-инъекция</h3>
            <p><strong>SQL-инъекция</strong> — это атака, когда злоумышленник вставляет свой SQL-код через пользовательский ввод. Она возможна, если ты склеиваешь строку запроса вручную.</p>
            <div class="callout warn"><div class="c-ic">☠️</div><div>Если логин ввести как <code class="inline">' OR '1'='1</code>, то запрос <code class="inline">WHERE name = '' OR '1'='1'</code> вернёт <strong>всех</strong> пользователей — защита обойдена.</div></div>
            <h4>Решение — параметры</h4>
            <p>Параметры (<code class="inline">@name</code>) передают значение отдельно от текста запроса. СУБД воспринимает их строго как данные, а не как код. Это закрывает инъекцию полностью.</p>
          `,
          example: {
            lang: "csharp",
            note: "Слева — опасно, справа — правильно.",
            code: `// ❌ ОПАСНО — склейка строк
string login = GetUserInput();
string bad = "SELECT * FROM users WHERE name = '" + login + "'";
// login = "' OR '1'='1"  ->  вернёт всех!

// ✅ ПРАВИЛЬНО — параметр
using var cmd = new NpgsqlCommand(
    "SELECT * FROM users WHERE name = @login", conn);
cmd.Parameters.AddWithValue("login", login);
using var reader = cmd.ExecuteReader();`
          },
          tasks: [
            { t: "Найди уязвимость", d: "easy",
              desc: "Перепиши безопасно: <code class='inline'>\"DELETE FROM notes WHERE id = \" + id</code>.",
              input: "—", output: "параметризованный запрос",
              hint: "Вынеси id в параметр @id.",
              solution: `using var cmd = new NpgsqlCommand("DELETE FROM notes WHERE id=@id", conn);
cmd.Parameters.AddWithValue("id", id);
cmd.ExecuteNonQuery();` },
            { t: "Поиск по имени", d: "medium",
              desc: "Безопасно найди пользователей, чьё имя содержит введённый текст (LIKE).",
              input: "search = al", output: "Ali, Valijon ...",
              hint: "WHERE name ILIKE @s, а параметр = \"%\" + search + \"%\"",
              solution: `using var cmd = new NpgsqlCommand("SELECT name FROM users WHERE name ILIKE @s", conn);
cmd.Parameters.AddWithValue("s", "%" + search + "%");
using var r = cmd.ExecuteReader();
while (r.Read()) Console.WriteLine(r.GetString(0));` },
            { t: "Логин", d: "medium",
              desc: "Напиши безопасную проверку логина и пароля (вернуть true, если запись найдена).",
              input: "login, password", output: "true / false",
              hint: "ExecuteScalar с COUNT(*) и двумя параметрами.",
              solution: `using var cmd = new NpgsqlCommand(
    "SELECT COUNT(*) FROM users WHERE login=@l AND password=@p", conn);
cmd.Parameters.AddWithValue("l", login);
cmd.Parameters.AddWithValue("p", password);
bool ok = Convert.ToInt32(cmd.ExecuteScalar()) > 0;
return ok;` }
          ]
        },
        {
          id: "ado-dataset",
          title: "DataSet и DataAdapter",
          duration: "22 мин",
          theory: `
            <h3>Работа с данными в памяти</h3>
            <p><strong>DataReader</strong> читает данные «на лету» и требует открытого соединения. <strong>DataSet</strong> наоборот — загружает данные в память целиком, после чего соединение можно закрыть.</p>
            <ul>
              <li><strong>DataAdapter</strong> — «мост» между БД и DataSet. Его метод <code class="inline">Fill()</code> наполняет DataSet.</li>
              <li><strong>DataTable</strong> — одна таблица в памяти (строки и колонки).</li>
            </ul>
            <div class="callout tip"><div class="c-ic">💡</div><div>DataReader — быстрее и экономнее по памяти. DataSet — удобнее, когда данные нужно хранить и обрабатывать офлайн. На практике в современных проектах чаще берут Dapper или EF Core.</div></div>
          `,
          example: {
            lang: "csharp",
            note: "Заполняем DataTable через DataAdapter.",
            code: `using var conn = new NpgsqlConnection(connString);
var adapter = new NpgsqlDataAdapter("SELECT id, name FROM students", conn);

var table = new DataTable();
adapter.Fill(table); // соединение откроется и закроется само

foreach (DataRow row in table.Rows)
{
    Console.WriteLine(row["id"] + " - " + row["name"]);
}`
          },
          tasks: [
            { t: "Заполнить DataTable", d: "medium",
              desc: "Загрузи все строки таблицы <code class='inline'>cities</code> в DataTable и выведи количество строк.",
              input: "cities: 5 строк", output: "5",
              hint: "adapter.Fill(table); затем table.Rows.Count",
              solution: `var adapter = new NpgsqlDataAdapter("SELECT * FROM cities", conn);
var table = new DataTable();
adapter.Fill(table);
Console.WriteLine(table.Rows.Count);` },
            { t: "Перебор строк", d: "medium",
              desc: "Выведи колонку <code class='inline'>name</code> из каждой строки DataTable.",
              input: "—", output: "имена построчно",
              hint: "foreach (DataRow row in table.Rows) ... row[\"name\"]",
              solution: `foreach (DataRow row in table.Rows)
{
    Console.WriteLine(row["name"]);
}` },
            { t: "DataReader vs DataSet", d: "easy",
              desc: "Назови в комментарии главное отличие DataReader от DataSet.",
              input: "—", output: "— (теория)",
              hint: "Одно требует открытого соединения, другое — нет.",
              solution: `// DataReader читает построчно и требует ОТКРЫТОГО соединения (forward-only).
// DataSet загружает данные в память ЦЕЛИКОМ — после Fill() соединение не нужно.` }
          ]
        }
      ]
    },

    /* ============== MODULE 2: Dapper ============== */
    {
      id: "dapper",
      icon: "⚡",
      title: "Dapper — микро-ORM",
      desc: "Быстрый маппинг результатов SQL в объекты C# без лишнего кода.",
      lessons: [
        {
          id: "dapper-intro",
          title: "Введение в Dapper",
          duration: "22 мин",
          theory: `
            <h3>Зачем нужен Dapper</h3>
            <p><strong>Dapper</strong> — это «микро-ORM» от создателей Stack Overflow. Он сам превращает строки из БД в объекты C#, но при этом остаётся очень быстрым — ты пишешь обычный SQL.</p>
            <h4>ADO.NET vs Dapper</h4>
            <ul>
              <li>ADO.NET — вручную читаешь каждую колонку через reader</li>
              <li>Dapper — одна строка <code class="inline">conn.Query&lt;Student&gt;(sql)</code> и готов список объектов</li>
            </ul>
            <p>Устанавливается пакетом: <code class="inline">dotnet add package Dapper</code>.</p>
          `,
          example: {
            lang: "csharp",
            note: "Dapper сам маппит колонки на свойства класса Student.",
            code: `using Dapper;

public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
}

using var conn = new NpgsqlConnection(connString);

// Query<T> возвращает IEnumerable<Student>
var students = conn.Query<Student>("SELECT id, name, age FROM students").ToList();

foreach (var s in students)
    Console.WriteLine(s.Id + " " + s.Name + " " + s.Age);`
          },
          tasks: [
            { t: "Query списка", d: "easy",
              desc: "Получи список всех городов (класс <code class='inline'>City { Id, Name }</code>) из таблицы cities.",
              input: "—", output: "List<City>",
              hint: "conn.Query<City>(\"SELECT id, name FROM cities\")",
              solution: `var cities = conn.Query<City>("SELECT id, name FROM cities").ToList();` },
            { t: "Параметр в Dapper", d: "medium",
              desc: "Получи одного пользователя по id через Dapper с анонимным параметром.",
              input: "id=3", output: "User",
              hint: "QueryFirstOrDefault<User>(sql, new { id })",
              solution: `var user = conn.QueryFirstOrDefault<User>(
    "SELECT * FROM users WHERE id = @id", new { id = 3 });` },
            { t: "Модель + Query", d: "medium",
              desc: "Опиши класс <code class='inline'>Product</code> (Id, Name, Price) и получи все товары дороже 100.",
              input: "min=100", output: "List<Product>",
              hint: "Передай параметр new { min = 100 }.",
              solution: `public class Product { public int Id {get;set;} public string Name {get;set;} public decimal Price {get;set;} }

var items = conn.Query<Product>(
    "SELECT * FROM products WHERE price > @min", new { min = 100 }).ToList();` }
          ]
        },
        {
          id: "dapper-methods",
          title: "Методы Dapper",
          duration: "24 мин",
          theory: `
            <h3>Основные методы</h3>
            <ul>
              <li><code class="inline">Query&lt;T&gt;</code> — список объектов</li>
              <li><code class="inline">QueryFirstOrDefault&lt;T&gt;</code> — первая запись или null</li>
              <li><code class="inline">QuerySingle&lt;T&gt;</code> — ровно одна запись (иначе ошибка)</li>
              <li><code class="inline">Execute</code> — INSERT/UPDATE/DELETE, возвращает число строк</li>
              <li><code class="inline">ExecuteScalar&lt;T&gt;</code> — одно значение</li>
            </ul>
            <p>Все методы есть и в асинхронном варианте: <code class="inline">QueryAsync</code>, <code class="inline">ExecuteAsync</code> и т.д.</p>
          `,
          example: {
            lang: "csharp",
            note: "Execute для изменения данных, ExecuteScalar для получения id.",
            code: `// INSERT и возврат id
int newId = conn.ExecuteScalar<int>(
    "INSERT INTO students (name, age) VALUES (@Name, @Age) RETURNING id",
    new { Name = "Ali", Age = 19 });

// UPDATE
int rows = conn.Execute(
    "UPDATE students SET age = @Age WHERE id = @Id",
    new { Age = 20, Id = newId });

Console.WriteLine("Создан id=" + newId + ", обновлено=" + rows);`
          },
          tasks: [
            { t: "Execute DELETE", d: "easy",
              desc: "Удали товар по id через Dapper и выведи число удалённых строк.",
              input: "id=7", output: "1",
              hint: "conn.Execute(\"DELETE ...\", new { id })",
              solution: `int rows = conn.Execute("DELETE FROM products WHERE id=@id", new { id = 7 });
Console.WriteLine(rows);` },
            { t: "QueryFirstOrDefault", d: "medium",
              desc: "Найди город по имени; если нет — вернётся null. Выведи имя или «не найдено».",
              input: "name=Khujand", output: "Khujand / не найдено",
              hint: "Проверь результат на null.",
              solution: `var city = conn.QueryFirstOrDefault<City>(
    "SELECT * FROM cities WHERE name=@n", new { n = "Khujand" });
Console.WriteLine(city?.Name ?? "не найдено");` },
            { t: "Async-версия", d: "medium",
              desc: "Перепиши получение списка пользователей на асинхронный <code class='inline'>QueryAsync</code>.",
              input: "—", output: "Task<List<User>>",
              hint: "await conn.QueryAsync<User>(...)",
              solution: `var users = (await conn.QueryAsync<User>("SELECT * FROM users")).ToList();` },
            { t: "ExecuteScalar", d: "medium",
              desc: "Получи общее количество заказов из таблицы orders через ExecuteScalar.",
              input: "—", output: "int",
              hint: "conn.ExecuteScalar<int>(\"SELECT COUNT(*) ...\")",
              solution: `int total = conn.ExecuteScalar<int>("SELECT COUNT(*) FROM orders");` }
          ]
        }
      ]
    },

    /* ============== MODULE 3: Async ============== */
    {
      id: "async",
      icon: "🔄",
      title: "Асинхронность и многопоточность",
      desc: "Task, Thread, async/await и Parallel — как не блокировать приложение.",
      lessons: [
        {
          id: "async-core",
          title: "Task, Thread, async/await, Parallel",
          duration: "28 мин",
          theory: `
            <h3>Поток vs Задача</h3>
            <p><strong>Thread</strong> — это поток ОС, он «тяжёлый». <strong>Task</strong> — абстракция над работой, которая может выполняться в пуле потоков. В .NET почти всегда работают с Task, а не с Thread напрямую.</p>
            <h4>async / await</h4>
            <p><code class="inline">async</code> помечает метод как асинхронный, <code class="inline">await</code> ждёт результат, <strong>не блокируя поток</strong>. Пока идёт ожидание (запрос в БД, HTTP), поток свободен для других запросов.</p>
            <h4>Parallel</h4>
            <p><code class="inline">Parallel.For / Parallel.ForEach</code> — для CPU-нагрузки (расчёты), когда нужно задействовать все ядра. Для ввода-вывода (I/O) используй async, а не Parallel.</p>
            <div class="callout warn"><div class="c-ic">⚠️</div><div>Не пиши <code class="inline">.Result</code> или <code class="inline">.Wait()</code> на Task в веб-приложении — это блокирует поток и ведёт к дедлокам. Всегда <code class="inline">await</code>.</div></div>
          `,
          example: {
            lang: "csharp",
            note: "await не блокирует поток; Task.WhenAll запускает задачи параллельно.",
            code: `public async Task<string> GetDataAsync()
{
    // await освобождает поток на время ожидания
    await Task.Delay(1000);
    return "готово";
}

// Запуск нескольких задач одновременно
var t1 = GetDataAsync();
var t2 = GetDataAsync();
string[] results = await Task.WhenAll(t1, t2); // ждём обе сразу (~1 сек, не 2)`
          },
          tasks: [
            { t: "Async-метод", d: "easy",
              desc: "Напиши async-метод <code class='inline'>Task&lt;int&gt; SumAsync(int a, int b)</code>, который возвращает сумму.",
              input: "a=2, b=3", output: "5",
              hint: "Можно вернуть через await Task.FromResult(a+b) или просто return a+b в async.",
              solution: `public async Task<int> SumAsync(int a, int b)
{
    await Task.Delay(10);
    return a + b;
}` },
            { t: "Task.WhenAll", d: "medium",
              desc: "Запусти три задачи <code class='inline'>GetDataAsync()</code> параллельно и дождись всех.",
              input: "—", output: "3 результата",
              hint: "Собери задачи в массив и передай в Task.WhenAll.",
              solution: `var tasks = new[] { GetDataAsync(), GetDataAsync(), GetDataAsync() };
var all = await Task.WhenAll(tasks);` },
            { t: "Ошибка блокировки", d: "medium",
              desc: "Найди проблему: <code class='inline'>var x = GetDataAsync().Result;</code> — как исправить?",
              input: "—", output: "await",
              hint: "Метод тоже должен стать async.",
              solution: `// Было: var x = GetDataAsync().Result; // блокирует поток, риск дедлока
var x = await GetDataAsync();` },
            { t: "Parallel.For", d: "hard",
              desc: "Посчитай квадраты чисел 1..1000 параллельно через Parallel.For, сложив их в потокобезопасный счётчик.",
              input: "—", output: "long sum",
              hint: "Используй Interlocked.Add для безопасного сложения.",
              solution: `long sum = 0;
Parallel.For(1, 1001, i =>
{
    Interlocked.Add(ref sum, (long)i * i);
});
Console.WriteLine(sum);` }
          ]
        }
      ]
    },

    /* ============== MODULE 4: Web + Web API ============== */
    {
      id: "webapi",
      icon: "🌐",
      title: "Как работает веб + Web API",
      desc: "HTTP, запросы и ответы, построение REST API на ASP.NET Core.",
      lessons: [
        {
          id: "how-web-works",
          title: "Как работает веб (HTTP)",
          duration: "20 мин",
          theory: `
            <h3>Клиент и сервер</h3>
            <p>Браузер (клиент) отправляет <strong>HTTP-запрос</strong>, сервер возвращает <strong>HTTP-ответ</strong>. Протокол без состояния (stateless): сервер не помнит прошлые запросы сам по себе.</p>
            <h4>HTTP-методы</h4>
            <ul>
              <li><strong>GET</strong> — получить данные</li>
              <li><strong>POST</strong> — создать</li>
              <li><strong>PUT / PATCH</strong> — обновить</li>
              <li><strong>DELETE</strong> — удалить</li>
            </ul>
            <h4>Коды статусов</h4>
            <ul>
              <li><strong>2xx</strong> — успех (200 OK, 201 Created)</li>
              <li><strong>4xx</strong> — ошибка клиента (400, 401, 404)</li>
              <li><strong>5xx</strong> — ошибка сервера (500)</li>
            </ul>
          `,
          example: {
            lang: "http",
            note: "Пример запроса и ответа.",
            code: `GET /api/students/5 HTTP/1.1
Host: localhost:5000
Accept: application/json

--- ОТВЕТ ---
HTTP/1.1 200 OK
Content-Type: application/json

{ "id": 5, "name": "Umar", "age": 20 }`
          },
          tasks: [
            { t: "Метод для создания", d: "easy",
              desc: "Какой HTTP-метод и код ответа правильны при успешном создании ресурса?",
              input: "—", output: "POST + 201 Created",
              hint: "Создание = POST, успех создания = 201.",
              solution: `// POST /api/students  ->  201 Created` },
            { t: "Код 404", d: "easy",
              desc: "Что означает статус 404 и когда его вернуть?",
              input: "—", output: "Not Found",
              hint: "Ресурс не найден.",
              solution: `// 404 Not Found — запрошенный ресурс не существует
// Например, GET /api/students/999, а такого id нет.` },
            { t: "Разбор запроса", d: "medium",
              desc: "Определи метод, путь и ожидаемый код для «обновить студента id=5».",
              input: "—", output: "PUT /api/students/5 -> 200",
              hint: "Обновление = PUT/PATCH.",
              solution: `// PUT /api/students/5  ->  200 OK (или 204 No Content)` }
          ]
        },
        {
          id: "webapi-basics",
          title: "Основы Web API (контроллеры)",
          duration: "28 мин",
          theory: `
            <h3>Контроллеры и маршруты</h3>
            <p>В ASP.NET Core Web API endpoint — это метод контроллера. Атрибуты <code class="inline">[HttpGet]</code>, <code class="inline">[HttpPost]</code> и маршрут <code class="inline">[Route]</code> связывают URL с методом.</p>
            <p>Возвращают обычно <code class="inline">IActionResult</code> или <code class="inline">ActionResult&lt;T&gt;</code>: <code class="inline">Ok()</code>, <code class="inline">NotFound()</code>, <code class="inline">CreatedAtAction()</code>, <code class="inline">BadRequest()</code>.</p>
          `,
          example: {
            lang: "csharp",
            note: "Типичный REST-контроллер.",
            code: `[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _service;
    public StudentsController(IStudentService service) => _service = service;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _service.GetAsync(id);
        if (student == null) return NotFound();
        return Ok(student);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateStudentDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}`
          },
          tasks: [
            { t: "GET all", d: "easy",
              desc: "Добавь метод, который возвращает всех студентов со статусом 200.",
              input: "—", output: "Ok(list)",
              hint: "[HttpGet] + return Ok(...)",
              solution: `[HttpGet]
public async Task<IActionResult> GetAll()
    => Ok(await _service.GetAllAsync());` },
            { t: "DELETE endpoint", d: "medium",
              desc: "Напиши метод DELETE по id: 204 если удалён, 404 если не найден.",
              input: "id", output: "204 / 404",
              hint: "NoContent() и NotFound().",
              solution: `[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    var ok = await _service.DeleteAsync(id);
    return ok ? NoContent() : NotFound();
}` },
            { t: "BadRequest", d: "medium",
              desc: "В методе Create верни 400, если dto.Name пустой.",
              input: "dto.Name = \"\"", output: "400 BadRequest",
              hint: "string.IsNullOrWhiteSpace(dto.Name)",
              solution: `if (string.IsNullOrWhiteSpace(dto.Name))
    return BadRequest("Name обязателен");` }
          ]
        }
      ]
    },

    /* ============== MODULE 5: Architecture ============== */
    {
      id: "arch",
      icon: "🏗️",
      title: "Архитектура ASP.NET Core",
      desc: "Dependency Injection, Middleware, Logging и Configuration.",
      lessons: [
        {
          id: "di",
          title: "Dependency Injection",
          duration: "26 мин",
          theory: `
            <h3>Что такое DI</h3>
            <p><strong>Dependency Injection</strong> — передача зависимостей объекту извне, а не создание их внутри. Класс просит интерфейс в конструкторе, а контейнер сам подставляет реализацию.</p>
            <h4>Три времени жизни</h4>
            <ul>
              <li><strong>Transient</strong> — новый экземпляр при каждом запросе зависимости</li>
              <li><strong>Scoped</strong> — один на HTTP-запрос</li>
              <li><strong>Singleton</strong> — один на всё приложение</li>
            </ul>
            <div class="callout tip"><div class="c-ic">💡</div><div>Для сервисов, работающих с БД (EF DbContext), используй <strong>Scoped</strong>.</div></div>
          `,
          example: {
            lang: "csharp",
            note: "Регистрация в Program.cs и внедрение через конструктор.",
            code: `// Program.cs — регистрируем зависимости
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddSingleton<IClock, SystemClock>();

// Внедрение через конструктор
public class StudentService : IStudentService
{
    private readonly AppDbContext _db;
    public StudentService(AppDbContext db) => _db = db; // DI сам передаст db
}`
          },
          tasks: [
            { t: "Регистрация Scoped", d: "easy",
              desc: "Зарегистрируй <code class='inline'>IOrderService</code> → <code class='inline'>OrderService</code> как Scoped.",
              input: "—", output: "AddScoped",
              hint: "builder.Services.AddScoped<интерфейс, реализация>();",
              solution: `builder.Services.AddScoped<IOrderService, OrderService>();` },
            { t: "Выбор времени жизни", d: "medium",
              desc: "Какое время жизни выбрать для EF <code class='inline'>DbContext</code> и почему (комментарий)?",
              input: "—", output: "Scoped",
              hint: "DbContext не потокобезопасен и живёт в рамках запроса.",
              solution: `// Scoped — один DbContext на HTTP-запрос.
// Singleton опасен (не потокобезопасен), Transient — лишние экземпляры.
builder.Services.AddDbContext<AppDbContext>(); // по умолчанию Scoped` },
            { t: "Внедрение в контроллер", d: "medium",
              desc: "Внедри <code class='inline'>IStudentService</code> в контроллер через конструктор.",
              input: "—", output: "constructor injection",
              hint: "private readonly + присваивание в конструкторе.",
              solution: `private readonly IStudentService _service;
public StudentsController(IStudentService service)
{
    _service = service;
}` }
          ]
        },
        {
          id: "middleware",
          title: "Middleware",
          duration: "22 мин",
          theory: `
            <h3>Конвейер обработки запроса</h3>
            <p><strong>Middleware</strong> — компоненты, через которые проходит каждый запрос по очереди (pipeline). Каждый может что-то сделать до и после следующего, вызвав <code class="inline">next()</code>.</p>
            <p>Порядок важен: аутентификация до авторизации, обработка ошибок — в самом начале.</p>
          `,
          example: {
            lang: "csharp",
            note: "Своё middleware для логирования времени запроса.",
            code: `app.Use(async (context, next) =>
{
    var sw = Stopwatch.StartNew();
    await next(); // передаём управление дальше по конвейеру
    sw.Stop();
    Console.WriteLine(context.Request.Path + " -> " + sw.ElapsedMilliseconds + "ms");
});

// Порядок встроенных middleware
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();`
          },
          tasks: [
            { t: "Своё middleware", d: "medium",
              desc: "Напиши inline-middleware, которое добавляет заголовок ответа <code class='inline'>X-App: SharpAcademy</code>.",
              input: "—", output: "header добавлен",
              hint: "context.Response.Headers.Append(...) до next().",
              solution: `app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-App", "SharpAcademy");
    await next();
});` },
            { t: "Порядок", d: "easy",
              desc: "Что идёт первым — UseAuthentication или UseAuthorization? Почему?",
              input: "—", output: "Authentication",
              hint: "Сначала «кто ты», потом «можно ли тебе».",
              solution: `// Сначала UseAuthentication (определяем пользователя),
// потом UseAuthorization (проверяем права).` }
          ]
        },
        {
          id: "logging",
          title: "Logging",
          duration: "16 мин",
          theory: `
            <h3>Логирование</h3>
            <p>ASP.NET Core имеет встроенный <code class="inline">ILogger&lt;T&gt;</code>. Внедряется через DI. Уровни: Trace, Debug, Information, Warning, Error, Critical.</p>
            <p>Используй структурное логирование с плейсхолдерами <code class="inline">{Name}</code>, а не склейку строк — так логи можно фильтровать.</p>
          `,
          example: {
            lang: "csharp",
            note: "Логгер внедряется и пишет структурные сообщения.",
            code: `public class StudentService
{
    private readonly ILogger<StudentService> _logger;
    public StudentService(ILogger<StudentService> logger) => _logger = logger;

    public void Create(string name)
    {
        _logger.LogInformation("Создаём студента {Name}", name);
        try { /* ... */ }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании {Name}", name);
        }
    }
}`
          },
          tasks: [
            { t: "Внедрить логгер", d: "easy",
              desc: "Внедри <code class='inline'>ILogger&lt;OrderService&gt;</code> и залогируй Information «Старт».",
              input: "—", output: "LogInformation",
              hint: "Конструктор + _logger.LogInformation(...)",
              solution: `private readonly ILogger<OrderService> _logger;
public OrderService(ILogger<OrderService> logger) => _logger = logger;
public void Run() => _logger.LogInformation("Старт");` },
            { t: "Лог ошибки", d: "medium",
              desc: "В блоке catch залогируй исключение как Error с сообщением и id.",
              input: "id", output: "LogError(ex, ...)",
              hint: "Первый аргумент — исключение.",
              solution: `catch (Exception ex)
{
    _logger.LogError(ex, "Сбой обработки заказа {Id}", id);
}` }
          ]
        },
        {
          id: "configuration",
          title: "Configuration",
          duration: "16 мин",
          theory: `
            <h3>Конфигурация приложения</h3>
            <p>Настройки хранятся в <code class="inline">appsettings.json</code>, переменных окружения, user-secrets. Читаются через <code class="inline">IConfiguration</code> или строго типизированно через <strong>Options pattern</strong>.</p>
          `,
          example: {
            lang: "csharp",
            note: "Options pattern: секция JSON → класс настроек.",
            code: `// appsettings.json
// "Jwt": { "Key": "secret", "Issuer": "SharpAcademy", "ExpireMinutes": 60 }

public class JwtOptions
{
    public string Key { get; set; }
    public string Issuer { get; set; }
    public int ExpireMinutes { get; set; }
}

// Program.cs
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

// Использование
public class TokenService(IOptions<JwtOptions> options)
{
    private readonly JwtOptions _jwt = options.Value;
}`
          },
          tasks: [
            { t: "Прочитать значение", d: "easy",
              desc: "Прочитай строку подключения <code class='inline'>ConnectionStrings:Default</code> из IConfiguration.",
              input: "—", output: "string",
              hint: "config.GetConnectionString(\"Default\")",
              solution: `string cs = builder.Configuration.GetConnectionString("Default");` },
            { t: "Bind секции", d: "medium",
              desc: "Привяжи секцию <code class='inline'>Jwt</code> к классу <code class='inline'>JwtOptions</code>.",
              input: "—", output: "Configure",
              hint: "GetSection(\"Jwt\") + Configure<JwtOptions>",
              solution: `builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt"));` }
          ]
        }
      ]
    },

    /* ============== MODULE 6: EF Core ============== */
    {
      id: "efcore",
      icon: "🧩",
      title: "Entity Framework Core",
      desc: "ORM от Microsoft: модели, связи, LINQ-запросы и маппинг.",
      lessons: [
        {
          id: "ef-intro",
          title: "Введение в EF Core",
          duration: "28 мин",
          theory: `
            <h3>EF Core — полноценный ORM</h3>
            <p><strong>Entity Framework Core</strong> превращает таблицы в классы (сущности), а работу с SQL — в методы LINQ. Центральный объект — <code class="inline">DbContext</code>, а таблицы — <code class="inline">DbSet&lt;T&gt;</code>.</p>
            <h4>Code First</h4>
            <p>Описываешь классы → создаёшь миграцию → EF генерирует таблицы: <code class="inline">dotnet ef migrations add Init</code>, затем <code class="inline">dotnet ef database update</code>.</p>
          `,
          example: {
            lang: "csharp",
            note: "DbContext, сущность и базовый запрос.",
            code: `public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> o) : base(o) { }
    public DbSet<Student> Students => Set<Student>();
}

// CRUD
var student = new Student { Name = "Umar", Age = 20 };
_db.Students.Add(student);
await _db.SaveChangesAsync();

var all = await _db.Students.ToListAsync();`
          },
          tasks: [
            { t: "Добавить сущность", d: "easy",
              desc: "Добавь новый город и сохрани изменения асинхронно.",
              input: "name=Bokhtar", output: "сохранено",
              hint: "_db.Cities.Add(...) + SaveChangesAsync()",
              solution: `_db.Cities.Add(new City { Name = "Bokhtar" });
await _db.SaveChangesAsync();` },
            { t: "Найти по id", d: "easy",
              desc: "Найди студента по id асинхронно (FindAsync).",
              input: "id=1", output: "Student?",
              hint: "await _db.Students.FindAsync(id)",
              solution: `var student = await _db.Students.FindAsync(1);` },
            { t: "Обновить", d: "medium",
              desc: "Найди студента id=1, измени возраст на 22 и сохрани.",
              input: "—", output: "обновлено",
              hint: "EF отслеживает изменения — достаточно поменять свойство и SaveChanges.",
              solution: `var s = await _db.Students.FindAsync(1);
if (s != null) { s.Age = 22; await _db.SaveChangesAsync(); }` },
            { t: "Удалить", d: "medium",
              desc: "Удали студента id=3, если он существует.",
              input: "—", output: "удалено",
              hint: "_db.Students.Remove(entity) + SaveChanges.",
              solution: `var s = await _db.Students.FindAsync(3);
if (s != null) { _db.Students.Remove(s); await _db.SaveChangesAsync(); }` }
          ]
        },
        {
          id: "ef-relations",
          title: "Связи между сущностями",
          duration: "26 мин",
          theory: `
            <h3>Виды связей</h3>
            <ul>
              <li><strong>Один ко многим (1:N)</strong> — у студента много оценок</li>
              <li><strong>Многие ко многим (N:M)</strong> — студенты и курсы</li>
              <li><strong>Один к одному (1:1)</strong> — пользователь и профиль</li>
            </ul>
            <p>Связь задаётся навигационными свойствами и внешним ключом (<code class="inline">FK</code>). Загрузка связанных данных — через <code class="inline">Include()</code>.</p>
          `,
          example: {
            lang: "csharp",
            note: "1:N — у группы много студентов, загрузка через Include.",
            code: `public class Group
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Student> Students { get; set; } = new();
}
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int GroupId { get; set; }       // внешний ключ
    public Group Group { get; set; }        // навигация
}

// Жадная загрузка связанных данных
var groups = await _db.Groups
    .Include(g => g.Students)
    .ToListAsync();`
          },
          tasks: [
            { t: "Внешний ключ", d: "easy",
              desc: "Добавь в класс <code class='inline'>Order</code> связь с <code class='inline'>User</code> (FK UserId + навигация).",
              input: "—", output: "UserId + User",
              hint: "int UserId; User User;",
              solution: `public int UserId { get; set; }
public User User { get; set; }` },
            { t: "Include", d: "medium",
              desc: "Загрузи все заказы вместе с их пользователями.",
              input: "—", output: "Include(o => o.User)",
              hint: "_db.Orders.Include(...)",
              solution: `var orders = await _db.Orders
    .Include(o => o.User)
    .ToListAsync();` },
            { t: "Вложенный Include", d: "hard",
              desc: "Загрузи группы → студентов → их оценки (ThenInclude).",
              input: "—", output: "Include + ThenInclude",
              hint: "После Include(g=>g.Students) используй ThenInclude(s=>s.Grades).",
              solution: `var data = await _db.Groups
    .Include(g => g.Students)
        .ThenInclude(s => s.Grades)
    .ToListAsync();` }
          ]
        },
        {
          id: "linq",
          title: "LINQ",
          duration: "30 мин",
          theory: `
            <h3>LINQ — язык запросов к данным</h3>
            <p><strong>LINQ</strong> позволяет фильтровать, сортировать и проецировать коллекции и запросы к БД одним синтаксисом. В EF Core LINQ превращается в SQL.</p>
            <h4>Главные операторы</h4>
            <ul>
              <li><code class="inline">Where</code> — фильтр</li>
              <li><code class="inline">Select</code> — проекция (выбор полей)</li>
              <li><code class="inline">OrderBy / OrderByDescending</code> — сортировка</li>
              <li><code class="inline">GroupBy</code> — группировка</li>
              <li><code class="inline">First / Single / Any / Count</code> — агрегаты</li>
            </ul>
            <div class="callout tip"><div class="c-ic">💡</div><div>В задачах на LINQ запрещай себе <code class="inline">for</code> и <code class="inline">foreach</code> — так быстрее освоишь декларативный стиль.</div></div>
          `,
          example: {
            lang: "csharp",
            note: "Фильтр + сортировка + проекция в анонимный объект.",
            code: `var result = students
    .Where(s => s.Age > 18 && s.GPA >= 3.5)
    .OrderByDescending(s => s.GPA)
    .Select(s => new { s.Name, s.GPA })
    .ToList();

// Группировка: сколько студентов в каждой группе
var byGroup = students
    .GroupBy(s => s.GroupId)
    .Select(g => new { GroupId = g.Key, Count = g.Count() });`
          },
          tasks: [
            { t: "Чётные ×10", d: "easy",
              desc: "Из массива чисел выбери чётные, отсортируй по убыванию и умножь каждое на 10. Без for/foreach.",
              input: "[1,2,3,4,5,6]", output: "[60,40,20]",
              hint: "Where + OrderByDescending + Select",
              solution: `var result = numbers
    .Where(n => n % 2 == 0)
    .OrderByDescending(n => n)
    .Select(n => n * 10)
    .ToList();` },
            { t: "Слова на 'a'", d: "medium",
              desc: "Из списка слов выбери начинающиеся на 'a', отсортируй по длине, спроецируй в { Word, Length }.",
              input: "apple, banana, apricot", output: "{apple,5},{apricot,7}",
              hint: "StartsWith(\"a\"), OrderBy(w=>w.Length)",
              solution: `var res = words
    .Where(w => w.StartsWith("a"))
    .OrderBy(w => w.Length)
    .Select(w => new { Word = w, Length = w.Length })
    .ToList();` },
            { t: "Фильтр студентов", d: "medium",
              desc: "Выбери студентов старше 18 и с GPA ≥ 3.5.",
              input: "—", output: "List",
              hint: "Where с двумя условиями через &&.",
              solution: `var good = students
    .Where(s => s.Age > 18 && s.GPA >= 3.5)
    .ToList();` },
            { t: "GroupBy + средний", d: "hard",
              desc: "Посчитай средний GPA по каждой группе (GroupId).",
              input: "—", output: "{GroupId, Avg}",
              hint: "GroupBy(s=>s.GroupId) + Average(x=>x.GPA)",
              solution: `var avg = students
    .GroupBy(s => s.GroupId)
    .Select(g => new { GroupId = g.Key, Avg = g.Average(s => s.GPA) })
    .ToList();` },
            { t: "Any / Count", d: "easy",
              desc: "Проверь, есть ли хоть один студент с GPA = 4.0, и посчитай их количество.",
              input: "—", output: "bool + int",
              hint: "Any(...) и Count(...)",
              solution: `bool hasTop = students.Any(s => s.GPA == 4.0);
int topCount = students.Count(s => s.GPA == 4.0);` }
          ]
        },
        {
          id: "mapping",
          title: "Mapping (DTO + AutoMapper)",
          duration: "20 мин",
          theory: `
            <h3>Зачем DTO и маппинг</h3>
            <p>Не отдавай сущности БД напрямую наружу — используй <strong>DTO</strong> (Data Transfer Object). Маппинг «сущность ↔ DTO» можно делать вручную или через <strong>AutoMapper</strong>.</p>
          `,
          example: {
            lang: "csharp",
            note: "Профиль AutoMapper и использование.",
            code: `public class StudentDto { public int Id {get;set;} public string Name {get;set;} }

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Student, StudentDto>();
    }
}

// Program.cs
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Использование
var dto = _mapper.Map<StudentDto>(student);
var list = _mapper.Map<List<StudentDto>>(students);`
          },
          tasks: [
            { t: "Ручной маппинг", d: "easy",
              desc: "Преврати <code class='inline'>Student</code> в <code class='inline'>StudentDto</code> вручную (Id, Name).",
              input: "—", output: "StudentDto",
              hint: "new StudentDto { Id = s.Id, Name = s.Name }",
              solution: `var dto = new StudentDto { Id = s.Id, Name = s.Name };` },
            { t: "CreateMap", d: "medium",
              desc: "Создай маппинг <code class='inline'>Product → ProductDto</code> в профиле AutoMapper.",
              input: "—", output: "CreateMap",
              hint: "В конструкторе Profile.",
              solution: `public class MappingProfile : Profile
{
    public MappingProfile() => CreateMap<Product, ProductDto>();
}` },
            { t: "Маппинг списка", d: "medium",
              desc: "Преврати список сущностей в список DTO через AutoMapper.",
              input: "—", output: "List<Dto>",
              hint: "_mapper.Map<List<ProductDto>>(products)",
              solution: `var dtos = _mapper.Map<List<ProductDto>>(products);` }
          ]
        }
      ]
    },

    /* ============== MODULE 7: API patterns ============== */
    {
      id: "patterns",
      icon: "📦",
      title: "Паттерны API",
      desc: "Единый формат ответа, пагинация, фильтрация, события и делегаты.",
      lessons: [
        {
          id: "generic-response",
          title: "Generic API Response",
          duration: "18 мин",
          theory: `
            <h3>Единый формат ответа</h3>
            <p>Чтобы фронтенд всегда получал одинаковую структуру, оборачивай данные в generic-обёртку: признак успеха, сообщение, данные, ошибки.</p>
          `,
          example: {
            lang: "csharp",
            note: "Универсальный ApiResponse<T>.",
            code: `public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }

    public static ApiResponse<T> Ok(T data, string msg = "OK")
        => new() { Success = true, Data = data, Message = msg };

    public static ApiResponse<T> Fail(string msg)
        => new() { Success = false, Message = msg };
}

// Использование в контроллере
return Ok(ApiResponse<StudentDto>.Ok(dto));`
          },
          tasks: [
            { t: "Обёртка успеха", d: "easy",
              desc: "Верни список студентов, завёрнутый в ApiResponse через фабрику Ok.",
              input: "—", output: "ApiResponse<List<...>>",
              hint: "ApiResponse<List<StudentDto>>.Ok(list)",
              solution: `return Ok(ApiResponse<List<StudentDto>>.Ok(list));` },
            { t: "Обёртка ошибки", d: "medium",
              desc: "Если студент не найден — верни Fail с сообщением «Не найден» и статусом 404.",
              input: "—", output: "ApiResponse.Fail",
              hint: "NotFound(ApiResponse<...>.Fail(...))",
              solution: `return NotFound(ApiResponse<StudentDto>.Fail("Не найден"));` }
          ]
        },
        {
          id: "pagination",
          title: "Pagination и Filtering",
          duration: "24 мин",
          theory: `
            <h3>Пагинация</h3>
            <p>Не отдавай тысячи записей сразу. Используй <code class="inline">Skip</code> и <code class="inline">Take</code>: <code class="inline">Skip((page-1)*size).Take(size)</code>. Фильтрацию строй условным наращиванием <code class="inline">IQueryable</code>.</p>
          `,
          example: {
            lang: "csharp",
            note: "Пагинация + условная фильтрация на IQueryable.",
            code: `public async Task<PagedResult<Student>> GetAsync(int page, int size, string? search)
{
    IQueryable<Student> query = _db.Students;

    if (!string.IsNullOrWhiteSpace(search))
        query = query.Where(s => s.Name.Contains(search));

    int total = await query.CountAsync();

    var items = await query
        .OrderBy(s => s.Id)
        .Skip((page - 1) * size)
        .Take(size)
        .ToListAsync();

    return new PagedResult<Student>(items, total, page, size);
}`
          },
          tasks: [
            { t: "Skip/Take", d: "easy",
              desc: "Получи 2-ю страницу по 10 элементов из students (page=2, size=10).",
              input: "page=2,size=10", output: "11..20",
              hint: "Skip((2-1)*10).Take(10)",
              solution: `var items = await _db.Students
    .OrderBy(s => s.Id)
    .Skip((2 - 1) * 10)
    .Take(10)
    .ToListAsync();` },
            { t: "Условный фильтр", d: "medium",
              desc: "Добавь фильтр по минимальному возрасту, только если minAge задан (> 0).",
              input: "minAge", output: "IQueryable с Where",
              hint: "if (minAge > 0) query = query.Where(...)",
              solution: `if (minAge > 0)
    query = query.Where(s => s.Age >= minAge);` },
            { t: "Всего страниц", d: "medium",
              desc: "Посчитай общее число страниц из total и size.",
              input: "total=45,size=10", output: "5",
              hint: "Math.Ceiling(total / (double)size)",
              solution: `int pages = (int)Math.Ceiling(total / (double)size);` }
          ]
        },
        {
          id: "events",
          title: "События, делегаты и Messaging",
          duration: "22 мин",
          theory: `
            <h3>Делегаты и события</h3>
            <p><strong>Делегат</strong> — это тип-указатель на метод. <strong>Событие</strong> (<code class="inline">event</code>) — механизм подписки: объект уведомляет подписчиков, когда что-то произошло. Основа паттерна «издатель-подписчик».</p>
            <p>В больших системах эту идею масштабируют через <strong>message broker</strong> (RabbitMQ, Kafka): сервисы обмениваются сообщениями асинхронно.</p>
          `,
          example: {
            lang: "csharp",
            note: "Событие OrderCreated и подписка на него.",
            code: `public class OrderService
{
    // делегат события
    public event Action<int> OrderCreated;

    public void Create(int id)
    {
        // ... сохранение заказа
        OrderCreated?.Invoke(id); // уведомляем подписчиков
    }
}

// Подписка
var service = new OrderService();
service.OrderCreated += id => Console.WriteLine("Заказ создан: " + id);
service.Create(42); // -> "Заказ создан: 42"`
          },
          tasks: [
            { t: "Объявить событие", d: "easy",
              desc: "Добавь в класс событие <code class='inline'>UserRegistered</code> типа Action&lt;string&gt; (email).",
              input: "—", output: "event",
              hint: "public event Action<string> UserRegistered;",
              solution: `public event Action<string> UserRegistered;` },
            { t: "Вызвать безопасно", d: "medium",
              desc: "Вызови событие UserRegistered с email, не падая, если подписчиков нет.",
              input: "—", output: "?.Invoke",
              hint: "Оператор ?. перед Invoke.",
              solution: `UserRegistered?.Invoke(email);` },
            { t: "Подписка", d: "medium",
              desc: "Подпишись на UserRegistered и выведи «Письмо отправлено на {email}».",
              input: "—", output: "+= handler",
              hint: "service.UserRegistered += email => ...",
              solution: `service.UserRegistered += email =>
    Console.WriteLine("Письмо отправлено на " + email);` }
          ]
        }
      ]
    },

    /* ============== MODULE 8: Security ============== */
    {
      id: "security",
      icon: "🔐",
      title: "Безопасность и доступ",
      desc: "Аутентификация, авторизация, JWT, Identity и роли.",
      lessons: [
        {
          id: "authn-authz",
          title: "Authentication vs Authorization",
          duration: "16 мин",
          theory: `
            <h3>Два разных понятия</h3>
            <ul>
              <li><strong>Authentication (аутентификация)</strong> — «кто ты?». Проверка личности (логин/пароль, токен).</li>
              <li><strong>Authorization (авторизация)</strong> — «что тебе можно?». Проверка прав (роль Admin и т.д.).</li>
            </ul>
            <div class="callout tip"><div class="c-ic">💡</div><div>Сначала аутентификация, потом авторизация. Нельзя проверить права, не зная, кто пользователь.</div></div>
          `,
          example: {
            lang: "csharp",
            note: "Атрибуты в контроллере.",
            code: `[Authorize]                       // только вошедшие (аутентификация)
public class AccountController : ControllerBase
{
    [HttpGet("profile")]
    public IActionResult Profile() => Ok("profile");

    [Authorize(Roles = "Admin")]  // только с ролью Admin (авторизация)
    [HttpDelete("{id}")]
    public IActionResult Delete(int id) => Ok();

    [AllowAnonymous]              // доступно всем
    [HttpGet("public")]
    public IActionResult Public() => Ok("hello");
}`
          },
          tasks: [
            { t: "Термины", d: "easy",
              desc: "Сопоставь: «проверка пароля» и «проверка роли Admin» — что есть что?",
              input: "—", output: "authn / authz",
              hint: "Пароль — кто ты; роль — что можно.",
              solution: `// Проверка пароля  -> Authentication (кто ты)
// Проверка роли Admin -> Authorization (что можно)` },
            { t: "Только админ", d: "medium",
              desc: "Закрой метод так, чтобы он был доступен только роли Admin.",
              input: "—", output: "[Authorize(Roles=\"Admin\")]",
              hint: "Атрибут над методом.",
              solution: `[Authorize(Roles = "Admin")]
public IActionResult DeleteAll() => Ok();` }
          ]
        },
        {
          id: "jwt",
          title: "JWT Authentication",
          duration: "30 мин",
          theory: `
            <h3>Проблема, которую решает JWT</h3>
            <p>В классическом подходе сервер хранит сессии в памяти — это плохо масштабируется на несколько серверов. Современный подход: сервер ничего не хранит, а выдаёт <strong>JWT-токен</strong>, который клиент присылает в каждом запросе.</p>
            <h4>Структура токена</h4>
            <p>JWT состоит из трёх частей через точку: <code class="inline">HEADER.PAYLOAD.SIGNATURE</code>.</p>
            <ul>
              <li><strong>Header</strong> — тип и алгоритм (HS256)</li>
              <li><strong>Payload</strong> — claims (id, email, role, exp)</li>
              <li><strong>Signature</strong> — подпись секретным ключом; защищает от подделки</li>
            </ul>
            <div class="callout warn"><div class="c-ic">⚠️</div><div>Payload не шифруется, а только кодируется (Base64). Не клади туда пароли и секреты — его может прочитать любой.</div></div>
          `,
          example: {
            lang: "csharp",
            note: "Генерация JWT-токена с claims.",
            code: `public string GenerateToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_jwt.Key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _jwt.Issuer,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(_jwt.ExpireMinutes),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}`
          },
          tasks: [
            { t: "Части JWT", d: "easy",
              desc: "Назови три части JWT по порядку.",
              input: "—", output: "Header.Payload.Signature",
              hint: "Через точку.",
              solution: `// HEADER . PAYLOAD . SIGNATURE` },
            { t: "Claims", d: "medium",
              desc: "Создай массив claims с id пользователя и ролью.",
              input: "—", output: "Claim[]",
              hint: "ClaimTypes.NameIdentifier и ClaimTypes.Role",
              solution: `var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Role, user.Role)
};` },
            { t: "Срок жизни", d: "medium",
              desc: "Задай срок действия токена — 60 минут от текущего UTC.",
              input: "—", output: "expires",
              hint: "DateTime.UtcNow.AddMinutes(60)",
              solution: `expires: DateTime.UtcNow.AddMinutes(60)` },
            { t: "Почему не секреты в payload", d: "easy",
              desc: "Объясни, почему нельзя класть пароль в payload JWT.",
              input: "—", output: "— (теория)",
              hint: "Base64 легко декодировать.",
              solution: `// Payload только кодируется в Base64, не шифруется.
// Любой может его декодировать и прочитать. Секретов там быть не должно.` }
          ]
        },
        {
          id: "identity",
          title: "ASP.NET Core Identity",
          duration: "26 мин",
          theory: `
            <h3>Готовая система пользователей</h3>
            <p><strong>ASP.NET Core Identity</strong> — встроенная система управления пользователями: регистрация, хэширование паролей, роли, подтверждение email. Основные классы: <code class="inline">UserManager</code>, <code class="inline">SignInManager</code>, <code class="inline">RoleManager</code>.</p>
          `,
          example: {
            lang: "csharp",
            note: "Регистрация пользователя через UserManager.",
            code: `public class AppUser : IdentityUser
{
    public string FullName { get; set; }
}

// Регистрация
var user = new AppUser { UserName = dto.Email, Email = dto.Email, FullName = dto.FullName };
var result = await _userManager.CreateAsync(user, dto.Password);

if (!result.Succeeded)
    return BadRequest(result.Errors);

await _userManager.AddToRoleAsync(user, "Student");`
          },
          tasks: [
            { t: "Создать пользователя", d: "medium",
              desc: "Создай пользователя через UserManager и проверь Succeeded.",
              input: "—", output: "CreateAsync",
              hint: "await _userManager.CreateAsync(user, password)",
              solution: `var result = await _userManager.CreateAsync(user, password);
if (!result.Succeeded) return BadRequest(result.Errors);` },
            { t: "Проверка пароля", d: "medium",
              desc: "Проверь логин через SignInManager (без cookie).",
              input: "—", output: "CheckPasswordSignInAsync",
              hint: "CheckPasswordSignInAsync(user, password, false)",
              solution: `var check = await _signInManager
    .CheckPasswordSignInAsync(user, password, false);
if (!check.Succeeded) return Unauthorized();` },
            { t: "Добавить роль", d: "easy",
              desc: "Назначь пользователю роль «Admin».",
              input: "—", output: "AddToRoleAsync",
              hint: "await _userManager.AddToRoleAsync(user, \"Admin\")",
              solution: `await _userManager.AddToRoleAsync(user, "Admin");` }
          ]
        },
        {
          id: "extended-identity",
          title: "Extended Identity (refresh, email confirm)",
          duration: "22 мин",
          theory: `
            <h3>Расширяем Identity</h3>
            <p>На практике к Identity добавляют: <strong>refresh-токены</strong> (чтобы обновлять JWT без повторного логина), подтверждение email, сброс пароля, блокировку после N неудачных попыток (lockout).</p>
          `,
          example: {
            lang: "csharp",
            note: "Генерация и использование токена подтверждения email.",
            code: `// Генерируем токен подтверждения
var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
// ... отправляем ссылку на email с этим токеном

// Подтверждение
var result = await _userManager.ConfirmEmailAsync(user, token);
if (result.Succeeded)
    Console.WriteLine("Email подтверждён");`
          },
          tasks: [
            { t: "Токен сброса пароля", d: "medium",
              desc: "Сгенерируй токен сброса пароля для пользователя.",
              input: "—", output: "GeneratePasswordResetTokenAsync",
              hint: "await _userManager.GeneratePasswordResetTokenAsync(user)",
              solution: `var token = await _userManager
    .GeneratePasswordResetTokenAsync(user);` },
            { t: "Зачем refresh-токен", d: "easy",
              desc: "Объясни, зачем нужен refresh-токен, если уже есть JWT.",
              input: "—", output: "— (теория)",
              hint: "JWT короткоживущий.",
              solution: `// JWT делают короткоживущим (например 15 мин) ради безопасности.
// Refresh-токен (долгоживущий) позволяет получить новый JWT
// без повторного ввода логина и пароля.` }
          ]
        },
        {
          id: "roles",
          title: "Role-Based Authorization",
          duration: "20 мин",
          theory: `
            <h3>Доступ по ролям</h3>
            <p>Роли (Admin, Student, Teacher) ограничивают доступ к endpoint'ам. Проверяются атрибутом <code class="inline">[Authorize(Roles = "...")]</code>. Для более гибкой логики используют <strong>policies</strong> (политики).</p>
          `,
          example: {
            lang: "csharp",
            note: "Роли и политика.",
            code: `// Несколько ролей
[Authorize(Roles = "Admin,Teacher")]
[HttpPost]
public IActionResult CreateCourse() => Ok();

// Политика
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Adult", p => p.RequireClaim("Age", "18"));
});

[Authorize(Policy = "Adult")]
[HttpGet("restricted")]
public IActionResult Restricted() => Ok();`
          },
          tasks: [
            { t: "Две роли", d: "easy",
              desc: "Разреши метод ролям Admin и Teacher.",
              input: "—", output: "Roles=\"Admin,Teacher\"",
              hint: "Роли через запятую.",
              solution: `[Authorize(Roles = "Admin,Teacher")]
public IActionResult Create() => Ok();` },
            { t: "Политика", d: "medium",
              desc: "Создай политику «OnlyAdmin», требующую роль Admin.",
              input: "—", output: "AddPolicy",
              hint: "p.RequireRole(\"Admin\")",
              solution: `options.AddPolicy("OnlyAdmin", p => p.RequireRole("Admin"));` }
          ]
        }
      ]
    },

    /* ============== MODULE 9: Performance ============== */
    {
      id: "perf",
      icon: "⚙️",
      title: "Производительность",
      desc: "Фоновые задачи и стратегии кеширования.",
      lessons: [
        {
          id: "background",
          title: "Background Tasks",
          duration: "24 мин",
          theory: `
            <h3>Фоновые задачи</h3>
            <p>Долгие операции (отправка писем, отчёты, очистка) не должны блокировать HTTP-ответ. В ASP.NET Core для этого есть <code class="inline">BackgroundService</code> (<code class="inline">IHostedService</code>) — сервис, работающий в фоне всё время жизни приложения.</p>
          `,
          example: {
            lang: "csharp",
            note: "Фоновый сервис, выполняющий работу каждые 10 секунд.",
            code: `public class CleanupService : BackgroundService
{
    private readonly ILogger<CleanupService> _logger;
    public CleanupService(ILogger<CleanupService> logger) => _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Очистка выполнена в {Time}", DateTime.Now);
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }
}

// Program.cs
builder.Services.AddHostedService<CleanupService>();`
          },
          tasks: [
            { t: "Регистрация", d: "easy",
              desc: "Зарегистрируй фоновый сервис <code class='inline'>EmailSender</code>.",
              input: "—", output: "AddHostedService",
              hint: "builder.Services.AddHostedService<EmailSender>();",
              solution: `builder.Services.AddHostedService<EmailSender>();` },
            { t: "Цикл с задержкой", d: "medium",
              desc: "В ExecuteAsync сделай цикл, который каждые 5 секунд выводит «tick», пока не отменён.",
              input: "—", output: "while + Task.Delay",
              hint: "while(!stoppingToken.IsCancellationRequested)",
              solution: `while (!stoppingToken.IsCancellationRequested)
{
    Console.WriteLine("tick");
    await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
}` }
          ]
        },
        {
          id: "caching",
          title: "Caching Strategies",
          duration: "26 мин",
          theory: `
            <h3>Зачем кеш</h3>
            <p>Кеш хранит готовый результат, чтобы не лезть каждый раз в БД или внешний API. Полезен, когда данные читаются часто, а меняются редко.</p>
            <h4>Виды кеша в .NET</h4>
            <ul>
              <li><strong>IMemoryCache</strong> — в памяти приложения. Быстро, но не общий для нескольких серверов.</li>
              <li><strong>IDistributedCache (Redis)</strong> — общий кеш для нескольких инстансов.</li>
            </ul>
            <div class="callout warn"><div class="c-ic">⚠️</div><div>Главная сложность кеша — <strong>инвалидация</strong>: вовремя сбросить устаревшие данные. «Есть две сложные задачи: именование и инвалидация кеша.»</div></div>
          `,
          example: {
            lang: "csharp",
            note: "Паттерн GetOrCreate с IMemoryCache.",
            code: `public async Task<List<City>> GetCitiesAsync()
{
    return await _cache.GetOrCreateAsync("cities", async entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
        return await _db.Cities.ToListAsync(); // вызовется только если нет в кеше
    });
}`
          },
          tasks: [
            { t: "Записать в кеш", d: "easy",
              desc: "Положи значение «result» в IMemoryCache под ключом «data» на 2 минуты.",
              input: "—", output: "Set",
              hint: "_cache.Set(key, value, TimeSpan...)",
              solution: `_cache.Set("data", "result", TimeSpan.FromMinutes(2));` },
            { t: "GetOrCreate", d: "medium",
              desc: "Верни список товаров из кеша, а если его нет — загрузи из БД и закешируй на 5 минут.",
              input: "—", output: "GetOrCreateAsync",
              hint: "entry.AbsoluteExpirationRelativeToNow = ...",
              solution: `return await _cache.GetOrCreateAsync("products", async entry =>
{
    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
    return await _db.Products.ToListAsync();
});` },
            { t: "Когда НЕ кешировать", d: "easy",
              desc: "Назови случай, когда кеш опасен.",
              input: "—", output: "— (теория)",
              hint: "Часто меняющиеся данные.",
              solution: `// Когда данные меняются часто, а инвалидация не продумана —
// пользователи будут видеть устаревшие данные (например, баланс счёта).` }
          ]
        }
      ]
    }
  ]
};

/* =========================================================
   INTERVIEW PREPARATION
   ========================================================= */
const INTERVIEW = {
  categories: [
    {
      id: "csharp",
      title: "C# и ООП",
      questions: [
        { q: "В чём разница между классом и структурой?", a: "Класс — ссылочный тип (reference), хранится в куче, передаётся по ссылке. Структура — значимый тип (value), хранится в стеке, копируется при передаче. Структуры хороши для маленьких неизменяемых данных.", hint: "reference vs value type" },
        { q: "Что такое boxing и unboxing?", a: "Boxing — упаковка значимого типа в object (в кучу). Unboxing — обратное извлечение. Это дорого по производительности, поэтому используют дженерики, чтобы его избегать.", hint: "value type ↔ object" },
        { q: "Разница между abstract class и interface?", a: "Абстрактный класс может иметь реализацию и поля, наследуется только один. Интерфейс — контракт (с C# 8 допускает default-методы), классов можно реализовать несколько.", hint: "один vs много" },
        { q: "Что такое SOLID?", a: "Пять принципов: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Делают код гибким и поддерживаемым.", hint: "5 принципов ООП" },
        { q: "Разница между == и .Equals()?", a: "Для ссылочных типов == по умолчанию сравнивает ссылки, Equals можно переопределить для сравнения по значению. Для строк == сравнивает содержимое.", hint: "ссылка vs значение" },
        { q: "Что такое делегат?", a: "Типобезопасный указатель на метод. Основа событий, LINQ и callback'ов. Примеры: Action, Func, Predicate.", hint: "указатель на метод" }
      ]
    },
    {
      id: "async-iv",
      title: "Асинхронность",
      questions: [
        { q: "Разница между Task и Thread?", a: "Thread — поток ОС, тяжёлый. Task — абстракция работы, выполняется в пуле потоков, поддерживает async/await, продолжения и отмену.", hint: "поток ОС vs абстракция" },
        { q: "Что делает await?", a: "Приостанавливает метод до завершения Task, не блокируя поток. Поток возвращается в пул и может обслуживать другие запросы.", hint: "не блокирует поток" },
        { q: "Почему нельзя .Result в ASP.NET?", a: "Блокирует поток и может вызвать deadlock из-за захвата контекста синхронизации. Всегда используйте await до самого верха (async all the way).", hint: "дедлок" },
        { q: "async void — когда можно?", a: "Только для обработчиков событий. В остальных случаях — async Task, иначе исключения невозможно поймать и нельзя дождаться завершения.", hint: "только event handlers" }
      ]
    },
    {
      id: "efcore-iv",
      title: "EF Core и БД",
      questions: [
        { q: "Что такое отслеживание изменений (change tracking)?", a: "EF запоминает состояние загруженных сущностей и при SaveChanges генерирует нужные UPDATE только для изменённых. AsNoTracking() отключает это для read-only запросов (быстрее).", hint: "SaveChanges" },
        { q: "В чём проблема N+1 запросов?", a: "Когда для списка сущностей в цикле подгружаются связанные данные по одной — получается N+1 обращений к БД. Решение — Include() (жадная загрузка).", hint: "Include" },
        { q: "IEnumerable vs IQueryable?", a: "IQueryable строит выражение и выполняет фильтрацию на стороне БД (SQL). IEnumerable загружает данные в память и фильтрует в приложении. В EF используйте IQueryable до материализации.", hint: "БД vs память" },
        { q: "Lazy vs Eager vs Explicit loading?", a: "Eager — Include() сразу. Lazy — подгрузка при обращении к навигации (нужны прокси). Explicit — вручную через Load(). Чаще безопаснее Eager.", hint: "Include / Load" },
        { q: "Зачем миграции?", a: "Миграции версионируют схему БД в коде: add migration фиксирует изменения моделей, database update применяет их. Позволяют воспроизводимо обновлять БД.", hint: "версии схемы" }
      ]
    },
    {
      id: "webapi-iv",
      title: "Web API и ASP.NET",
      questions: [
        { q: "Что такое middleware?", a: "Компоненты конвейера обработки запроса. Каждый выполняется по очереди, может обработать запрос/ответ и вызвать next(). Порядок регистрации важен.", hint: "pipeline" },
        { q: "Scoped, Transient, Singleton?", a: "Transient — новый экземпляр каждый раз. Scoped — один на HTTP-запрос. Singleton — один на всё приложение. DbContext — Scoped.", hint: "время жизни DI" },
        { q: "REST — основные принципы?", a: "Ресурсы через URL, HTTP-методы (GET/POST/PUT/DELETE) по смыслу, stateless, правильные статус-коды, единообразие. JSON как формат.", hint: "stateless, ресурсы" },
        { q: "Разница PUT и PATCH?", a: "PUT заменяет ресурс целиком, PATCH изменяет частично (отдельные поля). PUT идемпотентен.", hint: "целиком vs частично" },
        { q: "Что такое идемпотентность?", a: "Повторный одинаковый запрос даёт тот же результат. GET, PUT, DELETE идемпотентны, POST — нет.", hint: "повтор = тот же результат" }
      ]
    },
    {
      id: "security-iv",
      title: "Безопасность",
      questions: [
        { q: "Authentication vs Authorization?", a: "Authentication — кто ты (проверка личности). Authorization — что тебе можно (проверка прав/ролей). Сначала первое, потом второе.", hint: "кто / что можно" },
        { q: "Как устроен JWT?", a: "Три части через точку: Header (алгоритм), Payload (claims), Signature (подпись секретом). Payload только закодирован, не зашифрован.", hint: "Header.Payload.Signature" },
        { q: "Как защититься от SQL-инъекций?", a: "Использовать параметризованные запросы (@param) или ORM. Никогда не склеивать пользовательский ввод в строку SQL.", hint: "параметры" },
        { q: "Зачем хэшировать пароли?", a: "Чтобы при утечке БД нельзя было узнать пароли. Используют соль и медленные алгоритмы (bcrypt, PBKDF2). Identity делает это сам.", hint: "соль, bcrypt" },
        { q: "Access и Refresh токены?", a: "Access (JWT) короткоживущий для доступа к API. Refresh долгоживущий — для получения нового access без повторного логина.", hint: "короткий / длинный" }
      ]
    },
    {
      id: "general-iv",
      title: "Общее и архитектура",
      questions: [
        { q: "Что такое Dependency Injection?", a: "Передача зависимостей извне через конструктор вместо создания внутри класса. Снижает связанность, упрощает тесты и замену реализаций.", hint: "инверсия зависимостей" },
        { q: "Для чего нужны DTO?", a: "Отделить внутренние модели БД от того, что отдаётся клиенту: безопасность (не светим лишние поля), стабильность контракта API, гибкость.", hint: "контракт наружу" },
        { q: "Что такое кеширование и его риск?", a: "Хранение готового результата ради скорости. Риск — устаревшие данные при плохой инвалидации.", hint: "инвалидация" },
        { q: "Монолит vs микросервисы?", a: "Монолит — одно приложение, проще начать. Микросервисы — независимые сервисы, лучше масштабируются, но сложнее в эксплуатации. Начинать обычно лучше с монолита.", hint: "простота vs масштаб" },
        { q: "Что такое Repository pattern?", a: "Абстракция доступа к данным: контроллер/сервис работает с интерфейсом репозитория, не зная деталей БД. Упрощает тесты и замену хранилища.", hint: "абстракция над БД" }
      ]
    }
  ],
  tips: [
    "Проговаривай ответ вслух — на собесе важна не только правильность, но и как ты объясняешь.",
    "Если не знаешь — честно скажи и порассуждай, как бы ты это выяснил. Это ценят.",
    "Готовь примеры из своих проектов (Master Chas, FULL SELLER) — живой опыт сильнее теории.",
    "Проси уточнить задачу перед кодингом — это сигнал зрелого инженера."
  ]
};

/* =========================================================
   TESTS — тест по каждому модулю (ключ = id модуля)
   q: вопрос, options: варианты, correct: индекс, explain: пояснение
   ========================================================= */
const TESTS = {
  ado: [
    { q: "Какой драйвер нужен для работы с PostgreSQL в ADO.NET?", options: ["Npgsql", "SqlClient", "MySqlConnector", "Oracle.DataAccess"], correct: 0, explain: "Для PostgreSQL используется пакет Npgsql." },
    { q: "Какой метод используют для INSERT/UPDATE/DELETE?", options: ["ExecuteReader", "ExecuteScalar", "ExecuteNonQuery", "Fill"], correct: 2, explain: "ExecuteNonQuery возвращает число затронутых строк." },
    { q: "Как защититься от SQL-инъекции?", options: ["Склеивать строки через +", "Использовать параметры @name", "Проверять длину строки", "Писать запрос заглавными буквами"], correct: 1, explain: "Параметры передают значение отдельно от текста запроса." },
    { q: "Что делает ExecuteScalar?", options: ["Возвращает все строки", "Возвращает одно значение", "Открывает соединение", "Создаёт таблицу"], correct: 1, explain: "ExecuteScalar возвращает первое значение первой строки (COUNT, MAX, id)." },
    { q: "Чем DataReader отличается от DataSet?", options: ["Ничем", "DataReader требует открытого соединения, DataSet — нет", "DataSet быстрее", "DataReader хранит данные в файле"], correct: 1, explain: "DataReader читает построчно при открытом соединении, DataSet грузит данные в память целиком." }
  ],
  dapper: [
    { q: "Что такое Dapper?", options: ["Полноценный ORM", "Микро-ORM поверх ADO.NET", "База данных", "Веб-сервер"], correct: 1, explain: "Dapper — лёгкий микро-ORM: сам маппит результат в объекты, но ты пишешь SQL." },
    { q: "Какой метод вернёт список объектов?", options: ["Execute", "Query<T>", "Open", "Fill"], correct: 1, explain: "Query<T> возвращает IEnumerable<T>." },
    { q: "Как передать параметр в Dapper?", options: ["Через +", "Анонимным объектом new { id }", "Через global переменную", "Никак"], correct: 1, explain: "Параметры передают анонимным объектом: new { id = 5 }." },
    { q: "Что вернёт QueryFirstOrDefault, если записи нет?", options: ["Ошибку", "null (default)", "Пустую строку", "0"], correct: 1, explain: "Вернёт default(T) — для классов это null." },
    { q: "Какой метод для INSERT/UPDATE/DELETE в Dapper?", options: ["Query", "Execute", "Read", "Map"], correct: 1, explain: "Execute возвращает число затронутых строк." }
  ],
  async: [
    { q: "Чем Task отличается от Thread?", options: ["Ничем", "Task — абстракция над работой в пуле потоков", "Thread быстрее всегда", "Task — это база данных"], correct: 1, explain: "Thread — поток ОС (тяжёлый), Task — абстракция, выполняется в пуле потоков." },
    { q: "Что делает await?", options: ["Блокирует поток", "Ждёт результат, не блокируя поток", "Создаёт новый поток", "Останавливает приложение"], correct: 1, explain: "await освобождает поток на время ожидания." },
    { q: "Почему нельзя .Result в ASP.NET?", options: ["Это медленно", "Блокирует поток и грозит дедлоком", "Не компилируется", "Это устарело"], correct: 1, explain: "Синхронное ожидание может вызвать deadlock; всегда используйте await." },
    { q: "Что запускает задачи параллельно и ждёт все?", options: ["Task.Delay", "Task.WhenAll", "Thread.Sleep", "await по очереди"], correct: 1, explain: "Task.WhenAll ждёт завершения всех переданных задач." },
    { q: "Для чего Parallel.For?", options: ["Для ввода-вывода", "Для CPU-нагрузки на нескольких ядрах", "Для запросов к БД", "Для логирования"], correct: 1, explain: "Parallel.For — для CPU-bound расчётов. Для I/O используют async." }
  ],
  webapi: [
    { q: "Какой HTTP-метод создаёт ресурс?", options: ["GET", "POST", "DELETE", "HEAD"], correct: 1, explain: "POST создаёт, успех — 201 Created." },
    { q: "Что значит статус 404?", options: ["Успех", "Ошибка сервера", "Ресурс не найден", "Нет доступа"], correct: 2, explain: "404 Not Found — запрошенного ресурса нет." },
    { q: "Какой код у успешного создания?", options: ["200", "201", "204", "400"], correct: 1, explain: "201 Created — ресурс создан." },
    { q: "Что возвращает NotFound() в контроллере?", options: ["200", "404", "500", "301"], correct: 1, explain: "NotFound() — это 404." },
    { q: "Чем PUT отличается от PATCH?", options: ["Ничем", "PUT заменяет целиком, PATCH — частично", "PATCH удаляет", "PUT только читает"], correct: 1, explain: "PUT заменяет ресурс полностью, PATCH меняет отдельные поля." }
  ],
  arch: [
    { q: "Что такое Dependency Injection?", options: ["Создание объектов внутри класса", "Передача зависимостей извне", "Паттерн БД", "Вид цикла"], correct: 1, explain: "DI передаёт зависимости через конструктор, снижая связанность." },
    { q: "Какое время жизни у EF DbContext?", options: ["Singleton", "Transient", "Scoped", "Static"], correct: 2, explain: "DbContext регистрируют как Scoped — один на запрос." },
    { q: "Что такое Middleware?", options: ["Контроллер", "Компонент конвейера обработки запроса", "Таблица БД", "Клиент"], correct: 1, explain: "Middleware обрабатывает запрос по очереди в pipeline." },
    { q: "Что идёт раньше в конвейере?", options: ["UseAuthorization", "UseAuthentication", "MapControllers", "Неважно"], correct: 1, explain: "Сначала аутентификация (кто ты), потом авторизация (что можно)." },
    { q: "Где удобно хранить настройки приложения?", options: ["В коде через +", "В appsettings.json", "В комментариях", "В названии класса"], correct: 1, explain: "Настройки — в appsettings.json, читаются через IConfiguration/Options." }
  ],
  efcore: [
    { q: "Что такое DbContext?", options: ["Контроллер", "Центральный объект EF для доступа к данным", "Middleware", "DTO"], correct: 1, explain: "DbContext управляет подключением и DbSet'ами." },
    { q: "Как жадно загрузить связанные данные?", options: ["Select", "Include()", "Where", "GroupBy"], correct: 1, explain: "Include() подгружает связанные сущности (eager loading)." },
    { q: "Какой оператор LINQ фильтрует?", options: ["Select", "Where", "OrderBy", "Count"], correct: 1, explain: "Where оставляет элементы по условию." },
    { q: "В чём проблема N+1?", options: ["Мало памяти", "Лишние запросы к БД в цикле", "Ошибка компиляции", "Долгий старт"], correct: 1, explain: "N+1 — отдельный запрос на каждую связанную сущность; решается Include()." },
    { q: "Зачем нужны DTO?", options: ["Ускорить БД", "Не отдавать сущности БД напрямую наружу", "Заменить LINQ", "Создать таблицы"], correct: 1, explain: "DTO отделяют внутренние модели от контракта API." }
  ],
  patterns: [
    { q: "Зачем нужен Generic API Response?", options: ["Ускорить код", "Единый формат ответа для фронтенда", "Защита от инъекций", "Логирование"], correct: 1, explain: "Обёртка даёт единую структуру: success, message, data." },
    { q: "Какие методы LINQ дают пагинацию?", options: ["Where + Select", "Skip + Take", "First + Last", "Min + Max"], correct: 1, explain: "Skip((page-1)*size).Take(size)." },
    { q: "Что такое делегат?", options: ["Тип-указатель на метод", "Переменная int", "Таблица", "Контроллер"], correct: 0, explain: "Делегат ссылается на метод; основа событий." },
    { q: "Как безопасно вызвать событие без подписчиков?", options: ["event.Invoke()", "event?.Invoke()", "throw event", "new event"], correct: 1, explain: "Оператор ?. защищает от NullReferenceException." },
    { q: "Что масштабирует идею событий между сервисами?", options: ["Message broker (RabbitMQ/Kafka)", "DbContext", "LINQ", "DTO"], correct: 0, explain: "Брокеры сообщений реализуют асинхронный обмен между сервисами." }
  ],
  security: [
    { q: "Authentication — это...", options: ["что тебе можно", "кто ты", "вид БД", "тип токена"], correct: 1, explain: "Authentication — проверка личности (кто ты)." },
    { q: "Из скольких частей состоит JWT?", options: ["2", "3", "4", "1"], correct: 1, explain: "Header.Payload.Signature — три части." },
    { q: "Можно ли класть пароль в payload JWT?", options: ["Да, он зашифрован", "Нет, payload только кодируется в Base64", "Да, всегда", "Только админам"], correct: 1, explain: "Payload не шифруется — любой может его прочитать." },
    { q: "Что проверяет [Authorize(Roles=\"Admin\")]?", options: ["Пароль", "Наличие роли Admin", "Email", "Срок токена"], correct: 1, explain: "Это авторизация по роли." },
    { q: "Зачем нужен refresh-токен?", options: ["Ускорить сайт", "Обновлять access-токен без повторного логина", "Хранить пароль", "Шифровать БД"], correct: 1, explain: "Refresh (долгоживущий) выдаёт новый короткоживущий access-токен." }
  ],
  perf: [
    { q: "Для чего BackgroundService?", options: ["Рисовать UI", "Выполнять долгие задачи в фоне", "Хранить данные", "Авторизация"], correct: 1, explain: "BackgroundService работает в фоне всё время жизни приложения." },
    { q: "Как регистрируют фоновый сервис?", options: ["AddScoped", "AddHostedService", "AddController", "AddCache"], correct: 1, explain: "builder.Services.AddHostedService<T>()." },
    { q: "Когда кеш полезен?", options: ["Данные меняются каждую секунду", "Данные читаются часто, меняются редко", "Всегда", "Никогда"], correct: 1, explain: "Кеш эффективен для часто читаемых, редко меняющихся данных." },
    { q: "Главная сложность кеша?", options: ["Установка пакета", "Инвалидация (сброс устаревших данных)", "Цвет кнопки", "Название ключа"], correct: 1, explain: "Вовремя сбросить устаревшие данные — самое трудное в кешировании." },
    { q: "Что общее для нескольких серверов?", options: ["IMemoryCache", "IDistributedCache (Redis)", "static поле", "appsettings"], correct: 1, explain: "IMemoryCache локален; общий кеш — IDistributedCache/Redis." }
  ]
};
