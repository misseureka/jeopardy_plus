window.board = [
  {
    category: "События и места",
    questions: [
        {
          cost: 100,
          question: 'На этой станции метро раньше жили Алексей и Танюша.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 200,
          question: 'Именно столько лет Алексей и Танюша живут в Петербурге.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 300,
          question: 'Алексей и Танюша однажды съездили туда, пусть и не на недельку, но тем не менее получили массу неоднозначных воспоминаний.',
          type: 'text',
          answer: {
            type: 'img',
            media: 'media/komarovo.jpg',
          },
          isActive: true
        },
        {
          cost: 400,
          question: 'Что мы скрыли на фотографии?',
          type: 'img',
          media: 'media/tatyana_paris_censored.jpg',
          answer: {
            type: 'img',
            media: 'media/tatyana_paris.jpg'
          },
          isActive: true
        },
        {
          cost: 500,
          question: 'Именно в этот город состоялось самое первое совместное путешествие Алексея и Танюши.',
          type: 'text',
          answer: null,
          isActive: true
        }
    ]
  },
  {
    category: "Кино и Литература",
    questions: [
        {
          cost: 100,
          question: 'Танюша лично знакома с этим писателем. Ну как писателем? Просто человеком, который пишет буквы, которые потом становятся словами, которые читают люди, покупающие его книги...',
          type: 'text',
          answer: {
            type: 'img',
            media: 'media/grishkovets_pigface.jpg'
          },
          isActive: true
        },
        {
          cost: 200,
          question: 'Алексей утверждает, что онажды, лично видел этого писателя. Хотя, если как следует разобраться - это, скорее всего, была просто зыбь на глади реальности.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 300,
          question: 'Этот фильм Алексей постоянно цитирует. Назовите один из любимых цветов Танюши.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 400,
          question: 'Книга с автографом этого рок-музыканта есть в библиотеке Алексея. Кстати, про Таню (про другую) у него есть песня, правда немного трагичная.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 500,
          question: 'Оказывается, ТАКИМИ бывают чтения, спички, фильмы, лыжи и даже пельмени. Назовите любой из ТАКИХ фильмов.',
          type: 'text',
          answer: {
            type: 'img',
            media: 'media/everything_is_balabanovskoe.png'
          },
          isActive: true
        }
    ]
  },
  {
    category: "Верю-Не верю",
      questions: [
        {
          cost: 100,
          question: 'Алексей однажды совершил путешествие автостопом протяженностью примерно равной радиусу Земли, за один раз!',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 100,
          question: 'Танюша стала главной, и в какой-то степени заглавной героиней кинофильма.',
          type: 'text',
          answer: {
            type: 'img',
            media: 'media/tatyana_arctic.jpg'
          },
          isActive: true
        },
        {
          cost: 100,
          question: 'В самом начале знакомства Алексей и Танюша в атмосфере фильмов про хакеров выкладывали в сеть видеоклип о любовной связи Сами Знаете Кого с Сами Знаете Кем.',
          type: 'text',
          answer: {
            type: 'img',
            media: 'media/censored.gif'
          },
          isActive: true
        },
        {
          cost: 100,
          question: 'Алексей и Танюша однажды учинили акт вандализма с окном бара.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 100,
          question: 'Алексей и Танюша провозили наркотики (лёгкие!) через границу.',
          type: 'text',
          answer: null,
          isActive: true
        },
    ]
  },
  {
    category: "Странности",
    questions: [
      {
        cost: 100,
        question: 'Несмотря на это неприятное происшествие, Танюша успешно сдала экзамен на водительское удостоверение.',
        type: 'text',
        answer: null,
        isActive: true
      },
      {
        cost: 200,
        question: 'Как ни странно, но Алексей предпочитает именно такую разновидность театров.',
        type: 'text',
        answer: null,
        isActive: true
      },
      {
        cost: 300,
        question: 'Что мы скрыли на фотографии?',
        type: 'img',
        media: 'media/alex_censored.png',
        answer: {
          type: 'img',
          media: 'media/alex.jpg'
        },
        isActive: true
      },
      {
        cost: 400,
        question: 'Несмотря на то, что Танюша ненавидит ПЕТЬ ФАЛЬЦЕТОМ, как ни странно, она работала помощником юриста и даже в колл-центре авиакампании. Какие два слова мы заменили на "ПЕТЬ ФАЛЬЦЕТОМ"?',
        type: 'text',
        answer: null,
        isActive: true
      },
      {
        cost: 500,
        question: 'Если это не последний вопрос игры, то, как ни странно, ваша команда только что получила 500 очков. Потому что мы можем!',
        type: 'text',
        answer: {
          type: 'img',
          media: 'media/lenin_yes_we_can.jpg'
        },
        isActive: true
      },
    ]
  },
  {
    category: "Свадебная ЖЕСТЬ 18+",
    questions: [
        {
          cost: 100,
          question: 'Алексей и Танюша оба ненавидят эту песню про свадьбу. Хочется полагать, что ненавидят эту песню и небо и земля. А первым спел её Муслим Магомаев. Напойте эту песню.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 200,
          question: 'Телесериал ""Симпсоны"", как известно, содержит множество ""пасхалок"". Так, например, на изображении можно увидеть отсылку к картине художника Пукирева. Как называется картина?',
          type: 'img',
          media: 'media/simpsons.png',
          answer: {
            type: 'img',
            media: 'media/misalliance.jpg'
          },
          isActive: true
        },
        {
          cost: 300,
          question: 'В сериале "Игра Престолов" именно этот цвет присутствует в описании свадьбы, закончившейся убийством невесты, жениха а также всех присутствующих гостей с его стороны.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 400,
          question: 'Этот фильм был признан одним из самых грязных и отвратительных фильмов 20 века. Утверждается, что ни одна свинья в процессе его съёмок не пострадала.',
          type: 'text',
          answer: null,
          isActive: true
        },
        {
          cost: 500,
          question: 'Свадьба этих особ королевской крови предшествовала и стала одним из поводов массовой резни, ставшей нарицательной. Считается, что даже король стрелял в людей из своей аркебузы. Назовите любую из сочетавшихся браком особ.',
          type: 'text',
          answer: null,
          isActive: true
        }
    ]
  }
];
