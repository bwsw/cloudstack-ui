��    ;      �  O   �        �   	     �  �   �     �     �  (   �  +   �  5     E   A     �  :  �  L   �  |   !	  �   �	  �   M
  �   9  M   �      �   -  1   �  s     B   �  2   �  r   �     k     ~     �     �     �  \   �     %     B  /   K  �   {  v        z  �   �  !   .     P  �   Y  |   �     w  $   �  $   �  �   �  �   `  �   �  %   �     �    �  t     �   x  �   ,     
          "  |   1  *   �  �  �    �     �  �  �     V      v  P   �  b   �  M   K  c   �  "   �  �      �   �"  �   �#    �$    �&    �(  v   �)  �  <*  B  *,  x   m-  �   �-  �   �.  _   B/  �   �/     �0  #   �0  '   �0  S   1  '   V1  �   ~1  <   a2     �2  �   �2    @3  �   _4  &    5  C  '5  '   k6     �6  V  �6  �   �7  :   �8  Y   "9  $   |9  �   �9    �:    �;  h   �<     ;=  t  M=  �   �>    �?  g  �@     B  ,   1B     ^B  �   vB  I   @C               2         (               /   0      '                                         "   3   6         %       8                           -   ;   !   7      9   $              	         4      .   &              1   :   5   ,      *   
                 #   +              )       A theme color can be set in the configuration JSON file. You will find more information in the `configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#default-theme-name>`_. API Configuration Below you can view a connection URL which is used to send requests to CloudStack API. All requests are listed in the Apache CloudStack documentation available by the link. Change Password Change password; Click "UPDATE" to save the new password. Click "Update" to apply the set parameters. Click the field and select another color if you wish. Enter a new password and re-enter it in the next field to confirm it: First Day of Week For accounts with no API keys, the system autogenerates the keys when a user logs in if this option is enabled in the configuration file. Find more information in `the configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#automatically-generate-secret-key-and-api-key-for-users>`_. From the drop-down list select the day when a week starts: Monday or Sanday. Here you can change the password provided by your Administrator to the one you like. This will improve the account security. Here you can specify the maximum amount of time that an active session can be idle (without user activity) before it automatically closes. The default interval is 30 minutes. Here you have the opportunity to switch the time format from AM/PM to 24H. You can set it to "Auto" and the time format will be set in correspondence to the interface language: AM/PM if you select English and 24H if you select Russian. If this option is not activated, every time when creating a machine the system will ask you to save the password by clicking "SAVE" next to it: In case you have lost or forgotten your password, contact your Administrator. In the *Accounts* -> *Settings* section a user can modify the interface by changing settings. The interface settings are presented in separate sections: *Security, API configurations, VM preferences, Look and Feel*. Moving between sections is possible using the switcher above. In this block of settings you can see and manage the API configurations: regenerate API keys, see the connection URL, get the link to the Apache CloudStack API documentation. In this block you may set up the keyboard layout. In this block, you have the opportunity to choose between two types of weeks: Sunday - Saturday or Monday - Sunday. In this section a user can manage the following security settings: In this section you can adjust the interface look. In this settings block you can configure viewing VM logs in a real-time mode. The following parameters can be set: Interface Language Japanese keyboard Keyboard layout Log View (real-time mode) Look and Feel Regenerate the keys by clicking |refresh icon| above the fields. New keys will be generated. Save VM passwords by default Security Select a keyboard layout in the drop-down list. Select a preferred theme color. Currently two options are available: "blue-red" and "indigo-pink". The blue-red one is used by default. Select the language of your interface. Currently two options are available in the drop-down list: Russian and English. Session Timeout Set the desired time limit in minutes using the switch button |switch icon| to the right or typing it just into the field. Then click "UPDATE" to save the changes. Set the session timeout interval; Settings Show last (messages) - allows setting a maximum amount of logs to display. You can set from 1 to any number of log records. By default, 1000 messages are shown. Show last (minutes) - allows viewing logs for the last set period. You can set the number of minutes from 1 (default) to 10. Simplified Chinese keyboard. Standard US keyboard (default value) The following options are available: The maximum allowed value is 300 minutes. Please, note that a long time period of an idle session decreases the account security. The selected option will appear in the VNC console kayboard layout parameter when accessing a VM via concole. The selected option is also saved to user tags. The session timeout can be set in the configuration file. You will find more information in the  `configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#session-timeout>`_. The value is stored in user’s tags. Theme Color Then the system will ask you if you wish to save passwords to VM tags automatically. If you click "Yes", the "Save VM passwords by default" option will be activated in *Settings*. You will find more information about VM creation in the :ref:`Create_VM` section. This checkbox allows saving passwords to VM tags automatically for all created virtual machines requiring passwords. This section is available if the LogView UI-plugin is activated. See the `plugin page <https://github.com/bwsw/cloudstack-ui/wiki/Log-View-Plugin>`_ for installation instructions. Tick this option here. The passwords will be saved to VM tags right at the moment VMs are created. You will see a password (if it is required for the VM) is marked as saved in a dialog window after the new VM is deployed: Time Format UK keyboard VM preferences You can see an API key and a Secret key in corresponding fields. You can copy any of them clicking |copy icon| to the right. the "Save VM passwords by default" option. Project-Id-Version: CSUI
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2019-01-24 15:10+0700
PO-Revision-Date: 2019-01-24 15:12+0700
Last-Translator: 
Language: ru
Language-Team: 
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.4.0
X-Generator: Poedit 1.8.7.1
 Цвет темы можно установить в конфигурационном файле JSON. См.подробнее `руководство по конфигурациям <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#default-theme-name>`_. Конфигурация API В поле ниже отображается URL подключения, используемая для отправки запросов в CloudStack API. С полным перечнем используемых запросов можно ознакомиться в официальной документации Apache CloudStack, доступной по предоставленной ссылке. Изменение пароля Изменение пароля; Нажмите "ОБНОВИТЬ" и сохраните новый пароль. Нажмите «Обновить» для применения заданных значений. Кликните на поле и выберите желаемый цвет. Введите новый пароль и подтвердите его во втором поле: Первый день недели Для автоматического создания ключей API можно через конфигурационный файл  включить опцию, которая позволяет автоматически создавать ключ API и секретный ключ при входе пользователя в систему для тех аккаунтов, у которых нет ключей. Подробнее об этой настройке можно прочитать в `руководстве по конфигурациям <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#automatically-generate-secret-key-and-api-key-for-users>`_.  Выберите из ниспадающего списка день, с которого будет начинаться неделя: понедельник или воскресенье.  В данной секции можно изменить пароль, предоставленный Администратором, на желаемый пароль, что может улучшить безопасность аккаунта. В данной секции можно установить максимальное количество времени в минутах, в течение которого сессия будет оставаться активной в отсутствие действий пользователя. По истечение установленного времени сессия будет автоматически завершена. По умолчанию установлен интервал 30 минут. В данном блоке можно переключить формат времени с 12-часового на 24-часовой. При выборе варианта "Автоматически"  формат времени будет установлен в зависимости от выбранного языка интерфейса: если язык интерфейса английский - 12-часовой формат; если язык интерфейса русский - 24-часовой формат.  Если данная опция не активирована, каждый раз при создании ВМ система будет спрашивать о необходимости сохранить пароль, нажав "СОХРАНИТЬ" рядом с паролем: Если Вы забыли или потеряли пароль, обратитесь к Администратору. В разделе *Аккаунты -> Настройки* пользователь может менять настройки интерфейса. Все настройки разделены по разделам: *"Настройки безопасности", "Конфигурации API", "Настройки ВМ", "Настройки интерфейса".* Для перемещения между разделами используется переключатель вверху. В данном блоке настроек можно просматривать и управлять настройками API: создать новые ключи API, просматривать URL подключения, перейти к официальной документации по API Apache CloudStack. В данном блоке настроек можно задать раскладку клавиатуры для ВМ. В данном блоке можно выбрать один из типов недели: воскресенье - суббота или понедельник - воскресенье.  В этом подразделе  пользователь может управлять следующими настройками безопасности: В данном подразделе можно настроить вид интерфейса. В данном разделе настроек можно задать параметра просмотра журналов ВМ в режиме реального времени. Можно задать следующие параметры: Язык интерфейса Японская раскладка Раскладка клавиатуры Просмотр журналов в режиме реального времени Настройки интерфейса Для генерации нового ключа нажмите |refresh icon| вверху блока. В соответствующих полях появятся новые открытый и закрытый ключи. Сохранять пароли ВМ по умолчанию Безопасность Выберите подходящий вариант раскладки клавиатуры из ниспадающего списка. Выберите желаемый цвет темы. В текущей реализации доступны два варианта: сине-красный или индиго-розовый. Сине-красный цвет темы используется по умолчанию.  Выберите язык интерфейса из представленных в списке вариантов: русский или английский. Лимит времени сеанса Установите желаемый лимит вермени в минутах, используя  переключатель |switch icon| справа или посредством ввода значения в поле. Затем нажмите "ОБНОВИТЬ", чтобы сохранить изменения. Лимит времени сеанса; Настройки Максимальное количество отображаемых записей - позволяет задать максимальное число записей для показа; допустимые значения - от 1 до бесконечности. По умолчанию, показываются 1000 записей. Показывать за последние (минуты) - время, за которое вы желаете видеть записи; допустимые значения - от 1 (по умолчанию) до 10 минут. Упрощенная китайская раскладка Стандартная раскладка (США) (выбран по умолчанию) Доступные варианты: Максимальное разрешенное значение - 300 минут. Обратите внимание, что более длительный период сессии снижает безопасность аккаунта.  Выбранная опция появится в параметрах раскладки клавиатуры в консоли VNC  при доступе к ВМ через консоль. Заданные настройки сохраняются в теги пользователя. Лимит времени сеанса можно установить в конфигурационном файле. См. подробнее `руководство по конфигурациям <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#session-timeout>`_. Установленное значение сохраняется в теги пользователя. Цвет темы Затем система спросит, нужно ли автоматически сохранять пароли ВМ. Кликнув "Да", Вы активируете опцию "Сохранять пароли ВМ по умолчанию" в разделе *Настройки*. См.подробнее о создании ВМ в разделе :ref:`Create_VM`. Данная опция позволяет автоматически сохранять пароли в теги ВМ при создании машин, для которых необходимы пароли. Данный раздел доступен, если подключен плагин Log View. Инструкцию по установке плагина можно найти на `странице плагина <https://github.com/bwsw/cloudstack-ui/wiki/Log-View-Plugin>`_. Активируйте опцию в данной секции. При создании машины пароли сразу будут сохранятся в теги ВМ. В диалоговом окне создания ВМ пароль (если он требуется для данной ВМ) будет отмечен как сохраненный: Формат времени Английская раскладка (UK) Настройки ВМ Ключ API и Секретный ключ отображаются в соответствующих полях. Их можно скопировать нажатием на |copy icon| справа. Опция "Сохранять пароли ВМ по умолчанию" 