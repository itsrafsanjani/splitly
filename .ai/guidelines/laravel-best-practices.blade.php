### **Single responsibility principle**

A class should have only one responsibility.

Bad:

@verbatim
    <code-snippet name="Bad update method with multiple responsibilities" lang="php">
        public function update(Request $request): string
        {
            $validated = $request->validate([
                'title' => 'required|max:255',
                'events' => 'required|array:date,type'
            ]);

            foreach ($request->events as $event) {
                $date = $this->carbon->parse($event['date'])->toString();

                $this->logger->log('Update event ' . $date . ' :: ' . $);
            }

            $this->event->updateGeneralEvent($request->validated());

            return back();
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good update method with single responsibility" lang="php">
        public function update(UpdateRequest $request): string
        {
            $this->logService->logEvents($request->events);

            $this->event->updateGeneralEvent($request->validated());

            return back();
        }
    </code-snippet>
@endverbatim

### **Methods should do just one thing**

A function should do just one thing and do it well.

Bad:

@verbatim
    <code-snippet name="Bad method doing multiple things" lang="php">
        public function getFullNameAttribute(): string
        {
            if (auth()->user() && auth()->user()->hasRole('client') && auth()->user()->isVerified()) {
                return 'Mr. ' . $this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name;
            } else {
                return $this->first_name[0] . '. ' . $this->last_name;
            }
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good methods with single responsibility" lang="php">
        public function getFullNameAttribute(): string
        {
            return $this->isVerifiedClient() ? $this->getFullNameLong() : $this->getFullNameShort();
        }

        public function isVerifiedClient(): bool
        {
            return auth()->user() && auth()->user()->hasRole('client') && auth()->user()->isVerified();
        }

        public function getFullNameLong(): string
        {
            return 'Mr. ' . $this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name;
        }

        public function getFullNameShort(): string
        {
            return $this->first_name[0] . '. ' . $this->last_name;
        }
    </code-snippet>
@endverbatim

### **Fat models, skinny controllers**

Put all DB related logic into Eloquent models.

Bad:

@verbatim
    <code-snippet name="Bad controller with database logic" lang="php">
        public function index()
        {
            $clients = Client::verified()
                ->with(['orders' => function ($q) {
                    $q->where('created_at', '>', Carbon::today()->subWeek());
                }])
                ->get();

            return view('index', ['clients' => $clients]);
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good skinny controller" lang="php">
        public function index()
        {
            return view('index', ['clients' => $this->client->getWithNewOrders()]);
        }
    </code-snippet>
@endverbatim

@verbatim
    <code-snippet name="Good fat model with database logic" lang="php">
        class Client extends Model
        {
            public function getWithNewOrders(): Collection
            {
                return $this->verified()
                    ->with(['orders' => function ($q) {
                        $q->where('created_at', '>', Carbon::today()->subWeek());
                    }])
                    ->get();
            }
        }
    </code-snippet>
@endverbatim

### **Validation**

Move validation from controllers to Request classes.

Bad:

@verbatim
    <code-snippet name="Bad validation in controller" lang="php">
        public function store(Request $request)
        {
            $request->validate([
                'title' => 'required|unique:posts|max:255',
                'body' => 'required',
                'publish_at' => 'nullable|date',
            ]);

            ...
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good controller with form request" lang="php">
        public function store(PostRequest $request)
        {
            ...
        }
    </code-snippet>
@endverbatim

@verbatim
    <code-snippet name="Good form request validation" lang="php">
        class PostRequest extends Request
        {
            public function rules(): array
            {
                return [
                    'title' => 'required|unique:posts|max:255',
                    'body' => 'required',
                    'publish_at' => 'nullable|date',
                ];
            }
        }
    </code-snippet>
@endverbatim

### **Business logic should be in service class**

A controller must have only one responsibility, so move business logic from controllers to service classes.

Bad:

@verbatim
    <code-snippet name="Bad business logic in controller" lang="php">
        public function store(Request $request)
        {
            if ($request->hasFile('image')) {
                $request->file('image')->move(public_path('images') . 'temp');
            }

            ...
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good controller using service class" lang="php">
        public function store(Request $request)
        {
            $this->articleService->handleUploadedImage($request->file('image'));

            ...
        }
    </code-snippet>
@endverbatim

@verbatim
    <code-snippet name="Good service class for business logic" lang="php">
        class ArticleService
        {
            public function handleUploadedImage($image): void
            {
                if (!is_null($image)) {
                    $image->move(public_path('images') . 'temp');
                }
            }
        }
    </code-snippet>
@endverbatim

### **Don't repeat yourself (DRY)**

Reuse code when you can. SRP is helping you to avoid duplication. Also, reuse Blade templates, use Eloquent scopes etc.

Bad:

@verbatim
    <code-snippet name="Bad duplicated code" lang="php">
        public function getActive()
        {
            return $this->where('verified', 1)->whereNotNull('deleted_at')->get();
        }

        public function getArticles()
        {
            return $this->whereHas('user', function ($q) {
                $q->where('verified', 1)->whereNotNull('deleted_at');
            })->get();
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good reusable scope and methods" lang="php">
        public function scopeActive($q)
        {
            return $q->where('verified', true)->whereNotNull('deleted_at');
        }

        public function getActive(): Collection
        {
            return $this->active()->get();
        }

        public function getArticles(): Collection
        {
            return $this->whereHas('user', function ($q) {
                $q->active();
            })->get();
        }
    </code-snippet>
@endverbatim

### **Prefer to use Eloquent over using Query Builder and raw SQL queries. Prefer collections over arrays**

Eloquent allows you to write readable and maintainable code. Also, Eloquent has great built-in tools like soft deletes,
events, scopes etc. You may want to check out [Eloquent to SQL
reference](https://github.com/alexeymezenin/eloquent-sql-reference)

Bad:

@verbatim
    <code-snippet name="Bad raw SQL query" lang="sql">
        SELECT *
        FROM `articles`
        WHERE EXISTS (SELECT *
        FROM `users`
        WHERE `articles`.`user_id` = `users`.`id`
        AND EXISTS (SELECT *
        FROM `profiles`
        WHERE `profiles`.`user_id` = `users`.`id`)
        AND `users`.`deleted_at` IS NULL)
        AND `verified` = '1'
        AND `active` = '1'
        ORDER BY `created_at` DESC
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good Eloquent query" lang="php">
        Article::has('user.profile')->verified()->latest()->get();
    </code-snippet>
@endverbatim

### **Mass assignment**

Bad:

@verbatim
    <code-snippet name="Bad manual mass assignment" lang="php">
        $article = new Article;
        $article->title = $request->title;
        $article->content = $request->content;
        $article->verified = $request->verified;

        // Add category to article
        $article->category_id = $category->id;
        $article->save();
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good proper mass assignment" lang="php">
        $category->article()->create($request->validated());
    </code-snippet>
@endverbatim

### **Do not execute queries in Blade templates and use eager loading (N + 1 problem)**

Bad (for 100 users, 101 DB queries will be executed):

@verbatim
    <code-snippet name="Bad N+1 query problem in Blade" lang="blade">
        @foreach (User::all() as $user)
            {{ $user->profile->name }}
        @endforeach
    </code-snippet>
@endverbatim

Good (for 100 users, 2 DB queries will be executed):

@verbatim
    <code-snippet name="Good eager loading to solve N+1" lang="php">
        $users = User::with('profile')->get();

        @foreach ($users as $user)
            {{ $user->profile->name }}
        @endforeach
    </code-snippet>
@endverbatim

### **Chunk data for data-heavy tasks**

Bad:

@verbatim
    <code-snippet name="Bad loading all data at once" lang="php">
        $users = $this->get();

        foreach ($users as $user) {
            ...
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good chunking data for memory efficiency" lang="php">
        $this->chunk(500, function ($users) {
            foreach ($users as $user) {
                ...
            }
        });
    </code-snippet>
@endverbatim

### **Prefer descriptive method and variable names over comments**

Bad:

@verbatim
    <code-snippet name="Bad comment instead of descriptive method" lang="php">
        // Determine if there are any joins
        if (count((array) $builder->getQuery()->joins) > 0)
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good descriptive method name" lang="php">
        if ($this->hasJoins())
    </code-snippet>
@endverbatim

### **Do not put JS and CSS in Blade templates and do not put any HTML in PHP classes**

Bad:

@verbatim
    <code-snippet name="Bad direct PHP in JavaScript" lang="javascript">
        let article = `{{ json_encode($article) }}`;
    </code-snippet>
@endverbatim

Better:

@verbatim
    <code-snippet name="Better passing data to JavaScript" lang="php">
        <input id="article" type="hidden" value='@json($article)'>

        Or

        <button class="js-fav-article" data-article='@json($article)'>{{ $article->name }}
            <button>
    </code-snippet>
@endverbatim

In a Javascript file:

@verbatim
    <code-snippet name="JavaScript accessing data" lang="javascript">
        let article = $('#article').val();
    </code-snippet>
@endverbatim

The best way is to use specialized PHP to JS package to transfer the data.

### **Use config and language files, constants instead of text in the code**

Bad:

@verbatim
    <code-snippet name="Bad hardcoded text and magic strings" lang="php">
        public function isNormal(): bool
        {
            return $article->type === 'normal';
        }

        return back()->with('message', 'Your article has been added!');
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good constants and language files" lang="php">
        public function isNormal()
        {
            return $article->type === Article::TYPE_NORMAL;
        }

        return back()->with('message', __('app.article_added'));
    </code-snippet>
@endverbatim

### **Use standard Laravel tools accepted by community**

Prefer to use built-in Laravel functionality and community packages instead of using 3rd party packages and
tools. Any developer who will work with your app in the future will need to learn new tools. Also, chances to
get help from the Laravel community are significantly lower when you're using a 3rd party package or tool. Do
not make your client pay for that.

Task | Standard tools | 3rd party tools
------------ | ------------- | -------------
Authorization | Policies | Entrust, Sentinel and other packages
Compiling assets | Laravel Mix, Vite | Grunt, Gulp, 3rd party packages
Development Environment | Laravel Sail, Homestead | Docker
Deployment | Laravel Forge | Deployer and other solutions
Unit testing | PHPUnit, Mockery | Phpspec, Pest
Browser testing | Laravel Dusk | Codeception
DB | Eloquent | SQL, Doctrine
Templates | Blade | Twig
Working with data | Laravel collections | Arrays
Form validation | Request classes | 3rd party packages, validation in controller
Authentication | Built-in | 3rd party packages, your own solution
API authentication | Laravel Passport, Laravel Sanctum | 3rd party JWT and OAuth packages
Creating API | Built-in | Dingo API and similar packages
Working with DB structure | Migrations | Working with DB structure directly
Localization | Built-in | 3rd party packages
Realtime user interfaces | Laravel Echo, Pusher | 3rd party packages and working with WebSockets directly
Generating testing data | Seeder classes, Model Factories, Faker | Creating testing data manually
Task scheduling | Laravel Task Scheduler | Scripts and 3rd party packages
DB | MySQL, PostgreSQL, SQLite, SQL Server | MongoDB

### **Follow Laravel naming conventions**

Follow [PSR standards](https://www.php-fig.org/psr/psr-12/).

Also, follow naming conventions accepted by Laravel community:

What | How | Good | Bad
------------ | ------------- | ------------- | -------------
Controller | singular | ArticleController | ~~ArticlesController~~
Route | plural | articles/1 | ~~article/1~~
Route name | snake_case with dot notation | users.show_active | ~~users.show-active, show-active-users~~
Model | singular | User | ~~Users~~
hasOne or belongsTo relationship | singular | articleComment | ~~articleComments, article_comment~~
All other relationships | plural | articleComments | ~~articleComment, article_comments~~
Table | plural | article_comments | ~~article_comment, articleComments~~
Pivot table | singular model names in alphabetical order | article_user | ~~user_article, articles_users~~
Table column | snake_case without model name | meta_title | ~~MetaTitle; article_meta_title~~
Model property | snake_case | $model->created_at | ~~$model->createdAt~~
Foreign key | singular model name with _id suffix | article_id | ~~ArticleId, id_article, articles_id~~
Primary key | - | id | ~~custom_id~~
Migration | - | 2017_01_01_000000_create_articles_table | ~~2017_01_01_000000_articles~~
Method | camelCase | getAll | ~~get_all~~
Method in resource controller | [table](https://laravel.com/docs/master/controllers#resource-controllers) |
store | ~~saveArticle~~
Method in test class | camelCase | testGuestCannotSeeArticle | ~~test_guest_cannot_see_article~~
Variable | camelCase | $articlesWithAuthor | ~~$articles_with_author~~
Collection | descriptive, plural | $activeUsers = User::active()->get() | ~~$active, $data~~
Object | descriptive, singular | $activeUser = User::active()->first() | ~~$users, $obj~~
Config and language files index | snake_case | articles_enabled | ~~ArticlesEnabled; articles-enabled~~
View | kebab-case | show-filtered.blade.php | ~~showFiltered.blade.php, show_filtered.blade.php~~
Config | snake_case | google_calendar.php | ~~googleCalendar.php, google-calendar.php~~
Contract (interface) | adjective or noun | AuthenticationInterface | ~~Authenticatable, IAuthentication~~
Trait | adjective | Notifiable | ~~NotificationTrait~~
Trait [(PSR)](https://www.php-fig.org/bylaws/psr-naming-conventions/) | adjective | NotifiableTrait |
~~Notification~~
Enum | singular | UserType | ~~UserTypes~~, ~~UserTypeEnum~~
FormRequest | singular | UpdateUserRequest | ~~UpdateUserFormRequest~~, ~~UserFormRequest~~, ~~UserRequest~~
Seeder | singular | UserSeeder | ~~UsersSeeder~~

### **Convention over configuration**

As long as you follow certain conventions, you do not need to add additional configuration.

Bad:

@verbatim
    <code-snippet name="Bad overriding conventions" lang="php">
        // Table name 'Customer'
        // Primary key 'customer_id'
        class Customer extends Model
        {
        const CREATED_AT = 'created_at';
        const UPDATED_AT = 'updated_at';

        protected $table = 'Customer';
        protected $primaryKey = 'customer_id';

        public function roles(): BelongsToMany
        {
        return $this->belongsToMany(Role::class, 'role_customer', 'customer_id', 'role_id');
        }
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good following conventions" lang="php">
        // Table name 'customers'
        // Primary key 'id'
        class Customer extends Model
        {
        public function roles(): BelongsToMany
        {
        return $this->belongsToMany(Role::class);
        }
        }
    </code-snippet>
@endverbatim

### **Use shorter and more readable syntax where possible**

Bad:

@verbatim
    <code-snippet name="Bad verbose syntax" lang="php">
        $request->session()->get('cart');
        $request->input('name');
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good concise syntax" lang="php">
        session('cart');
        $request->name;
    </code-snippet>
@endverbatim

More examples:

Common syntax | Shorter and more readable syntax
------------ | -------------
`Session::get('cart')` | `session('cart')`
`$request->session()->get('cart')` | `session('cart')`
`Session::put('cart', $data)` | `session(['cart' => $data])`
`$request->input('name'), Request::get('name')` | `$request->name, request('name')`
`return Redirect::back()` | `return back()`
`is_null($object->relation) ? null : $object->relation->id` | `optional($object->relation)->id` (in PHP 8:
`$object->relation?->id`)
`return view('index')->with('title', $title)->with('client', $client)` | `return view('index', compact('title',
'client'))`
`$request->has('value') ? $request->value : 'default';` | `$request->get('value', 'default')`
`Carbon::now(), Carbon::today()` | `now(), today()`
`App::make('Class')` | `app('Class')`
`->where('column', '=', 1)` | `->where('column', 1)`
`->orderBy('created_at', 'desc')` | `->latest()`
`->orderBy('age', 'desc')` | `->latest('age')`
`->orderBy('created_at', 'asc')` | `->oldest()`
`->select('id', 'name')->get()` | `->get(['id', 'name'])`
`->first()->name` | `->value('name')`

### **Use IoC / Service container instead of new Class**

new Class syntax creates tight coupling between classes and complicates testing. Use IoC container or facades
instead.

Bad:

@verbatim
    <code-snippet name="Bad direct class instantiation" lang="php">
        $user = new User;
        $user->create($request->validated());
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good dependency injection" lang="php">
        public function __construct(protected User $user) {}

        ...

        $this->user->create($request->validated());
    </code-snippet>
@endverbatim

### **Do not get data from the `.env` file directly**

Pass the data to config files instead and then use the `config()` helper function to use the data in an
application.

Bad:

@verbatim
    <code-snippet name="Bad direct env() usage" lang="php">
        $apiKey = env('API_KEY');
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good config usage" lang="php">
        // config/api.php
        'key' => env('API_KEY'),

        // Use the data
        $apiKey = config('api.key');
    </code-snippet>
@endverbatim

### **Store dates in the standard format. Use accessors and mutators to modify date format**

A date as a string is less reliable than an object instance, e.g. a Carbon-instance. It's recommended to pass
Carbon objects between classes instead of date strings. Rendering should be done in the display layer
(templates):

Bad:

@verbatim
    <code-snippet name="Bad date formatting in Blade" lang="php">
        {{ Carbon::createFromFormat('Y-d-m H-i', $object->ordered_at)->toDateString() }}
        {{ Carbon::createFromFormat('Y-d-m H-i', $object->ordered_at)->format('m-d') }}
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good date casting and formatting" lang="php">
        // Model
        protected $casts = [
            'ordered_at' => 'datetime',
        ];

        // Blade view
        {{ $object->ordered_at->toDateString() }}
        {{ $object->ordered_at->format('m-d') }}
    </code-snippet>
@endverbatim

### **Do not use DocBlocks**

DocBlocks reduce readability. Use a descriptive method name and modern PHP features like return type hints
instead.

Bad:

@verbatim
    <code-snippet name="Bad excessive DocBlocks" lang="php">
        /**
        * The function checks if given string is a valid ASCII string
        *
        * @param string $string String we get from frontend which might contain
        * illegal characters. Returns True is the string
        * is valid.
        *
        * @return bool
        * @author John Smith
        *
        * @license GPL
        */

        public function checkString($string)
        {
        }
    </code-snippet>
@endverbatim

Good:

@verbatim
    <code-snippet name="Good descriptive method without DocBlocks" lang="php">
        public function isValidAsciiString(string $string): bool
        {
        }
    </code-snippet>
@endverbatim

### **Other good practices**

Avoid using patterns and tools that are alien to Laravel and similar frameworks (i.e. RoR, Django). If you like
Symfony (or Spring) approach for building apps, it's a good idea to use these frameworks instead.

Never put any logic in routes files.

Minimize usage of vanilla PHP in Blade templates.

Use in-memory DB for testing.

Do not override standard framework features to avoid problems related to updating the framework version and many
other issues.

Use modern PHP syntax where possible, but don't forget about readability.

Avoid using View Composers and similar tools unless you really know what you're doing. In most cases, there is a
better way to solve the problem.
