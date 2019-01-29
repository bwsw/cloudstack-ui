��    L      |  e   �      p  �   q     ?     Q  �   ^     
       (   +  +   T  5   �  6   �  3   �  E   !	     g	  7  y	  L   �
  |   �
  �   {  �   *  �     M   �    �  �   
  1   �  s   �  B   _  3   �  6   �  3     r   A     �     �     �     �     �     	  \     d   t     �     �  /   �  �   /  v   �     .  �   >  !   �       �     |   �     +  $   H    m    |  $   �  3   �  �   �  �   j  �     %   �     �      t     �   �  �   6        O       S   p   �   �      i!  �   u!  	   "     )"     8"  |   @"  F   �"  *   #  �  /#    �$     �%     &  �  -&     �'      �'  P   (  b   X(  M   �(  h   	)  m   r)  c   �)  "   D*  �  g*  �   -  �   �-    �.    �0    �2  v   
4  �  �4  B  o6  x   �7  �   +8  �   �8  _   �9  u   �9  �   ]:  �   �:     �;  #   �;  
   <  '   (<  S   P<  '   �<  �   �<  �   �=  <   W>     �>  �   �>    6?  �   U@  &   �@  C  A  '   aB     �B  V  �B  �   �C  :   �D  Y   E    rE    �I  $   �M  b   �M  �   (N    O    :P  h   YQ     �Q  t  �Q  �   IS    T  g  4U     �V  �   �V  �   \W    �W  ,   Y    8Y  !   PZ     rZ     �Z  �   �Z  �   g[  I   �[     H   6      *   >         #          $   K              9      -   B   /   ,   G   .   !   0   2         D                          J                   '   F   +                 (           &                 3            =      @          :   	   E          )   5   I   <            
      8   4   1              "   ?      C               %       ;   7            A   L    A theme color can be set in the configuration JSON file. You will find more information in the `configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#default-theme-name>`_. API Configuration Account tags Below you can view a connection URL which is used to send requests to CloudStack API. All requests are listed in the Apache CloudStack documentation available by the link. Change Password Change password; Click "UPDATE" to save the new password. Click "Update" to apply the set parameters. Click the field and select another color if you wish. Click “Create” to assign a new tag to the account. Click “Create” to assign a new tag to the user. Enter a new password and re-enter it in the next field to confirm it: First Day of Week For users with no API keys, the system autogenerates the keys when a user logs in if this option is enabled in the configuration file. Find more information in `the configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#automatically-generate-secret-key-and-api-key-for-users>`_. From the drop-down list select the day when a week starts: Monday or Sanday. Here you can change the password provided by your Administrator to the one you like. This will improve the account security. Here you can specify the maximum amount of time that an active session can be idle (without user activity) before it automatically closes. The default interval is 30 minutes. Here you have the opportunity to switch the time format from AM/PM to 24H. You can set it to "Auto" and the time format will be set in correspondence to the interface language: AM/PM if you select English and 24H if you select Russian. If this option is not activated, every time when creating a machine the system will ask you to save the password by clicking "SAVE" next to it: In case you have lost or forgotten your password, contact your Administrator. In the *Accounts* -> *Settings* section a user can modify the interface by changing settings. The interface settings are presented in separate sections: *Security, API configurations, VM preferences, Look and Feel*. Moving between sections is possible using the switcher above. In this block of settings you can see and manage the API configurations: regenerate API keys, see the connection URL, get the link to the Apache CloudStack API documentation. In this block you may set up the keyboard layout. In this block, you have the opportunity to choose between two types of weeks: Sunday - Saturday or Monday - Sunday. In this section a user can manage the following security settings: In this section, you can adjust the interface look. In this section, you can view and manage account tags. In this section, you can view and manage user tags. In this settings block you can configure viewing VM logs in a real-time mode. The following parameters can be set: Interface Language Japanese keyboard Key * Keyboard layout Log View (real-time mode) Look and Feel Regenerate the keys by clicking |refresh icon| above the fields. New keys will be generated. Required fields are marked with an asterisk (*). The values in the fields cannot start with a space. Save VM passwords by default Security Select a keyboard layout in the drop-down list. Select a preferred theme color. Currently two options are available: "blue-red" and "indigo-pink". The blue-red one is used by default. Select the language of your interface. Currently two options are available in the drop-down list: Russian and English. Session Timeout Set the desired time limit in minutes using the switch button |switch icon| to the right or typing it just into the field. Then click "UPDATE" to save the changes. Set the session timeout interval; Settings Show last (messages) - allows setting a maximum amount of logs to display. You can set from 1 to any number of log records. By default, 1000 messages are shown. Show last (minutes) - allows viewing logs for the last set period. You can set the number of minutes from 1 (default) to 10. Simplified Chinese keyboard. Standard US keyboard (default value) Tags can be system or non-system. System tags are used to provide the functionality from the user interface perspective. Changing these tags affects the functionality of the application. The “Show system tags” checkbox allows to view or hide system tags of a user. Hiding system tags helps to avoid accidental unwanted changes. If a user has disabled displaying of such tags, the system will remember it and next time tags will also be hidden. Uncheck the “Show system tags” checkbox to hide system tags from the list. Tags can be system or non-system. System tags are used to provide the functionality from the user interface perspective. Changing these tags affects the functionality of the application. The “Show system tags” checkbox allows to view or hide system tags of an account. Hiding system tags helps to avoid accidental unwanted changes. If a user has disabled displaying of such tags, the system will remember it and next time tags will also be hidden. Uncheck the “Show system tags” checkbox to hide system tags from the list. The following options are available: The following system tags can be used for accounts: The maximum allowed value is 300 minutes. Please, note that a long time period of an idle session decreases the account security. The selected option will appear in the VNC console kayboard layout parameter when accessing a VM via concole. The selected option is also saved to user tags. The session timeout can be set in the configuration file. You will find more information in the  `configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#session-timeout>`_. The value is stored in user’s tags. Theme Color Then the system will ask you if you wish to save passwords to VM tags automatically. If you click "Yes", the "Save VM passwords by default" option will be activated in *Settings*. You will find more information about VM creation in the :ref:`Create_VM` section. This checkbox allows saving passwords to VM tags automatically for all created virtual machines requiring passwords. This section is available if the LogView UI-plugin is activated. See the `plugin page <https://github.com/bwsw/cloudstack-ui/wiki/Log-View-Plugin>`_ for installation instructions. Tick this option here. The passwords will be saved to VM tags right at the moment VMs are created. You will see a password (if it is required for the VM) is marked as saved in a dialog window after the new VM is deployed: Time Format To add a user tag click “Create” |create icon|. In the appeared form enter: To add an account tag click “Create” |create icon|. In the appeared form enter: To find the tag you are interested in, please, use the search tool above the tag list. You can enter a name or a part of the tag name to distinguish it in the list. UK keyboard User system tags has the format of ``csui.user.<tag_name>``. You can view a full list of user tags at the `wiki-page <https://github.com/bwsw/cloudstack-ui/wiki/Tags>`_. User tags VM preferences Value * You can see an API key and a Secret key in corresponding fields. You can copy any of them clicking |copy icon| to the right. ``csui.account.ssh-description`` - Used to provide an SSH description. the "Save VM passwords by default" option. Project-Id-Version: CSUI
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2019-01-29 14:50+0700
PO-Revision-Date: 2019-01-29 14:58+0700
Last-Translator: 
Language: ru
Language-Team: 
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.4.0
X-Generator: Poedit 1.8.7.1
 Цвет темы можно установить в конфигурационном файле JSON. См.подробнее `руководство по конфигурациям <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#default-theme-name>`_. Конфигурация API Теги аккаунта В поле ниже отображается URL подключения, используемая для отправки запросов в CloudStack API. С полным перечнем используемых запросов можно ознакомиться в официальной документации Apache CloudStack, доступной по предоставленной ссылке. Изменение пароля Изменение пароля; Нажмите "ОБНОВИТЬ" и сохраните новый пароль. Нажмите «Обновить» для применения заданных значений. Кликните на поле и выберите желаемый цвет. Нажмите «СОЗДАТЬ» для добавления нового тега к аккаунту. Нажмите «СОЗДАТЬ» для добавления нового тега пользователя. Введите новый пароль и подтвердите его во втором поле: Первый день недели Для автоматического создания ключей API для пользователей, не имеющих ключей, можно через конфигурационный файл  включить опцию, которая позволяет автоматически создавать ключ API и секретный ключ при входе пользователя в систему . Подробнее об этой настройке можно прочитать в `руководстве по конфигурациям <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#automatically-generate-secret-key-and-api-key-for-users>`_.  Выберите из ниспадающего списка день, с которого будет начинаться неделя: понедельник или воскресенье.  В данной секции можно изменить пароль, предоставленный Администратором, на желаемый пароль, что может улучшить безопасность аккаунта. В данной секции можно установить максимальное количество времени в минутах, в течение которого сессия будет оставаться активной в отсутствие действий пользователя. По истечение установленного времени сессия будет автоматически завершена. По умолчанию установлен интервал 30 минут. В данном блоке можно переключить формат времени с 12-часового на 24-часовой. При выборе варианта "Автоматически"  формат времени будет установлен в зависимости от выбранного языка интерфейса: если язык интерфейса английский - 12-часовой формат; если язык интерфейса русский - 24-часовой формат.  Если данная опция не активирована, каждый раз при создании ВМ система будет спрашивать о необходимости сохранить пароль, нажав "СОХРАНИТЬ" рядом с паролем: Если Вы забыли или потеряли пароль, обратитесь к Администратору. В разделе *Аккаунты -> Настройки* пользователь может менять настройки интерфейса. Все настройки разделены по разделам: *"Настройки безопасности", "Конфигурации API", "Настройки ВМ", "Настройки интерфейса".* Для перемещения между разделами используется переключатель вверху. В данном блоке настроек можно просматривать и управлять настройками API: создать новые ключи API, просматривать URL подключения, перейти к официальной документации по API Apache CloudStack. В данном блоке настроек можно задать раскладку клавиатуры для ВМ. В данном блоке можно выбрать один из типов недели: воскресенье - суббота или понедельник - воскресенье.  В этом подразделе  пользователь может управлять следующими настройками безопасности: В данном подразделе можно настроить вид интерфейса. В этом разделе можно просматривать и управлять тегами аккаунта. В данном подразделе можно просматривать и управлять тегами пользователя. В данном разделе настроек можно задать параметра просмотра журналов ВМ в режиме реального времени. Можно задать следующие параметры: Язык интерфейса Японская раскладка Ключ * Раскладка клавиатуры Просмотр журналов в режиме реального времени Настройки интерфейса Для генерации нового ключа нажмите |refresh icon| вверху блока. В соответствующих полях появятся новые открытый и закрытый ключи. Обязательные поля отмечены «звездочкой» (*). Значения в полях не могут начинаться с пробела. Сохранять пароли ВМ по умолчанию Безопасность Выберите подходящий вариант раскладки клавиатуры из ниспадающего списка. Выберите желаемый цвет темы. В текущей реализации доступны два варианта: сине-красный или индиго-розовый. Сине-красный цвет темы используется по умолчанию.  Выберите язык интерфейса из представленных в списке вариантов: русский или английский. Лимит времени сеанса Установите желаемый лимит вермени в минутах, используя  переключатель |switch icon| справа или посредством ввода значения в поле. Затем нажмите "ОБНОВИТЬ", чтобы сохранить изменения. Лимит времени сеанса; Настройки Максимальное количество отображаемых записей - позволяет задать максимальное число записей для показа; допустимые значения - от 1 до бесконечности. По умолчанию, показываются 1000 записей. Показывать за последние (минуты) - время, за которое вы желаете видеть записи; допустимые значения - от 1 (по умолчанию) до 10 минут. Упрощенная китайская раскладка Стандартная раскладка (США) (выбран по умолчанию) Теги могут быть системными и несистемными. Системные теги обеспечивают дополнительную функциональность с точки зрения пользовательского интерфейса. Изменение этих тегов может затронуть работу всего приложения. Можно включить или выключить отображение системных тегов с помощью опции «Показывать системные теги». При выключении данной опции системные теги будут скрыты из списка, что поможет избежать случайных нежелательных изменений в них. Система запомнит, что отображение системных тегов отключено, и в дальнейшем системные теги не будут отображаться в списке. Теги могут быть системными и несистемными. Системные теги обеспечивают дополнительную функциональность с точки зрения пользовательского интерфейса. Изменение этих тегов может затронуть работу всего приложения. Можно включить или выключить отображение системных тегов с помощью опции «Показывать системные теги». При выключении данной опции системные теги будут скрыты из списка, что поможет избежать случайных нежелательных изменений в них. Система запомнит, что отображение системных тегов отключено, и в дальнейшем системные теги не будут отображаться в списке. Доступные варианты: Для аккаунтов используются следующие системные теги: Максимальное разрешенное значение - 300 минут. Обратите внимание, что более длительный период сессии снижает безопасность аккаунта.  Выбранная опция появится в параметрах раскладки клавиатуры в консоли VNC  при доступе к ВМ через консоль. Заданные настройки сохраняются в теги пользователя. Лимит времени сеанса можно установить в конфигурационном файле. См. подробнее `руководство по конфигурациям <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#session-timeout>`_. Установленное значение сохраняется в теги пользователя. Цвет темы Затем система спросит, нужно ли автоматически сохранять пароли ВМ. Кликнув "Да", Вы активируете опцию "Сохранять пароли ВМ по умолчанию" в разделе *Настройки*. См.подробнее о создании ВМ в разделе :ref:`Create_VM`. Данная опция позволяет автоматически сохранять пароли в теги ВМ при создании машин, для которых необходимы пароли. Данный раздел доступен, если подключен плагин Log View. Инструкцию по установке плагина можно найти на `странице плагина <https://github.com/bwsw/cloudstack-ui/wiki/Log-View-Plugin>`_. Активируйте опцию в данной секции. При создании машины пароли сразу будут сохранятся в теги ВМ. В диалоговом окне создания ВМ пароль (если он требуется для данной ВМ) будет отмечен как сохраненный: Формат времени Для добавления тега пользователя нажмите «Создать» |create icon|. В появившейся форме введите: Для добавления тега аккаунта нажмите «Создать» |create icon|. В появившейся форме введите: Для быстрого поиска тега в списке воспользуйтесь инструментом поиска вверху. Введите название или часть названия тега, и оно будет выделено в списке. Английская раскладка (UK) Системные теги пользователя имеют формат ``csui.user.<tag_name>``. Просмотреть полный список тегов пользователя можно на `странице wiki <https://github.com/bwsw/cloudstack-ui/wiki/Tags>`_. Теги пользователя Настройки ВМ Значение * Ключ API и Секретный ключ отображаются в соответствующих полях. Их можно скопировать нажатием на |copy icon| справа. ``csui.account.ssh-description`` -  используется для сохранения описания для ключа SSH. Опция "Сохранять пароли ВМ по умолчанию" 