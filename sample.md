# function *qualityGuide* () 

## two

dsalgdasg
----------------------

> A **`quality conscious`** and _organic_ 
JavaScript quality guide

This style [baidu](http://baidu.com) guide aims to provide the ground rules
 for an application's JavaScript code, such that it's highly readable and consistent across different developers on a team. The focus is put on quality and coherence across the different pieces of your application.
![baidu](https://www.baidu.com/img/bd_logo1.png)

## Goal

These suggestions aren't set in stone, they aim to provide a baseline you can use in order to write more consistent codebases. To maximize effectiveness, share the styleguide among your co-workers and attempt to enforce it. Don't become obsessed about code style, as it'd be fruitless and counterproductive. Try and find the sweet spot that makes everyone in the team comfortable developing for your codebase, while not feeling frustrated that their code always fails automated style checking because they added a single space where they weren't supposed to. It's a thin line, but since it's a very personal line I'll leave it to you to do the drawing.

> Use together with [bevacqua/css][32] for great good!

Feel free to fork this style guide, or better yet, send [Pull Requests][33] this way!

## Table of Contents

* [Modules](#modules) aaaa bbb
ccc eee fff
* [Strict Mode](#strict-mode)
* [Spacing](#spacing)


1. [Modules](#modules)
2. [Strict Mode](#strict-mode)
3. [Spacing](#spacing)


## Modules

This style guide assumes you're using a module system such as [CommonJS][1], [AMD][2], [ES6 Modules][3], or any other kind of module system. Modules systems provide individual scoping, avoid leaks to the `global` object, and improve code base organization by **automating dependency graph generation**, instead of having to resort to manually creating multiple `<script>` tags.

Module systems also provide us with dependency injection patterns, which are crucial when it comes to testing individual components in isolation.

## Strict Mode

**Always** put [`'use strict';`][4] at the top of your modules. Strict mode allows you to catch nonsensical behavior, discourages poor practices, and _is faster_ because it allows compilers to make certain assumptions about your code.

## Spacing

Spacing must be consistent across every file in the application. To this end, using something like [`.editorconfig`][5] configuration files is highly encouraged. Here are the defaults I suggest to get started with JavaScript indentation.

```ini
# editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

Settling for either tabs or spaces is up to the particularities of a project, but I recommend using 2 spaces for indentation. The `.editorconfig` file can take care of that for us and everyone would be able to create the correct spacing by pressing the tab key.

```c#

nihao1

nihao2

nihao3

```

Spacing doesn't just entail tabbing, but also the spaces before, after, and in between arguments of a function declaration. This kind of spacing is **typically highly irrelevant to get right**, and it'll be hard for most teams to even arrive at a scheme that will satisfy everyone.

  [5]: http://editorconfig.org
  [6]: http://dailyjs.com/2012/12/24/817-javascript-survey-results
  [7]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding


  
  