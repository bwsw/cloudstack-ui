��    0      �  C         (  
   )     4  W   G  4  �  C   �          !  �  .  �   �  3  |  #   �	  �   �	  P   Y
     �
     �
     �
  �   �
  5  R  {   �  &     
   +     6  #   =  6   a  [   �  .   �     #     2     ;  	   D      N     o      w  ,   �  u   �  v   ;  0  �  H   �  I   ,  r   v  r   �  ,   \     �     �     �  �   �  k   �  �       �  %   �  �   �  5  �  �   �     m     ~    �  �   �  B  �  7   �  �      �   �   *   �!     �!     �!  C  �!  7  3#  �   k%  ?   _&     �&  
   �&  ;   �&  [   '  �   ]'  L   �'  '   E(     m(     }(     �(  *   �(     �(  <   �(  U   )  h  n)  �   �*  o  �+  �   /  �   �/    >0  �   U1  a   )2  $   �2  $   �2      �2  z  �2  �   q4        /       !                      (       	      )                        .                       $            -                        "                             &           %   
      '          0   ,   *   #   +                    *Accounts* *Virtual Machines* A Domain Administrator can view resources for his/her account and for the whole domain. A user can add the information on support services to all error messages to make it faster to get the support in case of failure. This information should be specified in the ``support-info.md`` file stored in a `special folder <https://github.com/bwsw/cloudstack-ui/tree/master/src/support>`_ of the project. A user can see the resource usage statistics for his/her user only. Accounts Activity log Administrator can set a domain in configurations. Domain field will be prepopulated with the specified value. It is more convenient for a user as he/she does not need to enter the domain every time at logging in. In this case the domain field can be hidden by clicking |adv icon|. Find more information on the feature configuration at the `configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#default-domain>`_. Alongside with the notification panel, the action completion confirmation additionally appears in the snackbar notification at the page bottom. Another way to log in is to enter a URL in the format ``http://<ip-address>/login?domain=<domain>``. The domain will be prepopulated in the logging in form with the value that is specified in the URL. Please, note, the domain value in URL will override the domain set in the configurations by Administrator. Computational resources - CPU, RAM; Domain - Specify domain when you log in. CloudStak-UI supports three ways to do it. Choose the one which is more convenient for you: Enter a domain in the field under the "Show advanced options" button |adv icon|. Error messages Firewall Images In case of errors at data loading the snackbar also notifies of them. In this case it has a refresh button that refreshes the whole app. In the upper-right corner of the screen, you can see the list of pending operations by clicking a bell button |bell icon|. It informs you of the latest operations in the system. You can clear the list after its reviewing by deleting every notification one by one or by clicking "CLEAR ALL" at the list bottom. In this section you can see the resource statistics: used and free VMs, computational resources, volumes and storage space. Localization of the file is supported. Logging In Logout Notifications on Pending Operations Password * - The password associated with the user ID. Push "Login" to proceed to CloudStack. You will see the first section - *Virtual Machines*. Required fields are marked with asterisks (*). Resource Usage SSH keys Settings Snapshots Start Working With CloudStack-UI Storage Storage - primary and secondary. The Logout section is placed at both levels. The specified support details will display under a drop-down menu. Click it in the error message window to expand it. Then deploy CloudStack-UI (see the `instructions for deployment <https://github.com/bwsw/cloudstack-ui#deployment>`_). This page is aimed to help you to make first steps at CloudStack-UI. If you have never worked with CloudStack before, you should start with installing the CloudStack platform. Follow the instruction in `the official documentation <http://docs.cloudstack.apache.org/en/4.11.1.0/installguide/index.html>`_. To enter the platform use your credentials provided by an administrator: To move between levels, click |menu icon| and then one of the two levels. To the left you can see the main navigation bar. It shows the user name and allows moving from section to section. Unfold *Resource Usage* panel in the upper part of the screen. It provides information on the following resources: User name * -   The user ID of your account. Virtual machines Virtual machines; Volumes and snapshots; When entering the system, a user sees the *Virtual Machines* section at the second level of the menu. At the first level, the main navigation bar has two expandable sections with the following nested menu items: You can switch between used or free resources by clicking the option you need above the resource data list. Project-Id-Version: CSUI
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2019-01-25 09:52+0700
PO-Revision-Date: 2019-01-25 10:25+0700
Last-Translator: 
Language: ru
Language-Team: 
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.4.0
X-Generator: Poedit 1.8.7.1
 *Аккаунты* *Виртуальные машины* Администратор домена может видеть ресурсы для своего аккаунта и для всего домена.  Пользователь может добавить информацию о службе поддержки во все сообщения об ошибках. Это позволит быстрее связаться со службой и получить помощь при возникновении ошибок. Информация должна быть указана в файле ``support-info.md``, который хранится в `специальной папке <https://github.com/bwsw/cloudstack-ui/tree/master/src/support>`_  проекта. Пользователь может видеть статистику использования ресурсов только для своего пользователя. Аккаунты Журнал событий Администратор может установить домен в конфигурационном файле. В этом случае заданное значение будет автоматически указываться в качестве домена при входе в систему. Пользователю не придется вводить его каждый раз при авторизации. Поле домена можно скрыть, нажав на |adv icon|. Подробнее об определении домена через конфигурационный файл читайте в `руководстве по конфигурациям <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#default-domain>`_. Помимо уведомлений в панели оповещений, подтверждение завершения действия дублируется внизу экрана в дополнительной панели.  Еще одним способом авторизации является вход через URL с указанием в ней домена в следующем формате: ``http://<ip-address>/login?domain=<domain>``.  Значение домена из URL будет автоматически задано в форме авторизации. *Примечание*: значение домена из URL переопределяет значение домена, заданного Администратором в конфигурационном файле. Вычислительные ресурсы - CPU, RAM; Домен — Укажите домен при входе. CloudStak-UI поддерживает три способа ввода домена. Выберите тот, который для вас более удобен: Введите домен в поле, которое раскрывается нажатием кнопки "Показать дополнительные параметры" |adv icon|. Уведомления об ошибках Брандмауэр Образы Также, дополнительная панель появляется при возникновении ошибок загрузки данных. В этом случае на ней предусмотрена кнопка "Обновить", которая позволяет обновить всю систему. В верхнем правом углу экрана можно просматривать список недавних действий, нажав кнопку |bell icon|. Этот список сообщает Вам о последних операциях в системе. После просмотра списка можно очистить его, удалив каждое уведомление один за другим, или нажав "ОЧИСТИТЬ" в конце списка для удаления всех оповещений сразу. В этом разделе Вы видите статистику использования ресурсов: используемые и свободные ВМ, вычислительные ресурсы, диски и хранилища.  Поддерживается локализация файла. Вход в систему Выход Оповещения о недавних действиях Пароль * -  Пароль, соответствующий ID пользователя. Нажмите "Войти" для перехода в CloudStack. Вы увидите первый раздел - *Виртуальные Машины*.  Обязательные поля отмечены звездочкой (*). Используемые ресурсы SSH ключи  Настройки Снимки Начало работы с CloudStack-UI Хранилище Хранилище - основное и вторичное. Раздел "Выход" расположен в меню обоих уровней. Указанная контактная информация службы поддержки будет отображаться в раскрывающемся блоке "Информация о технической поддержке" в окне уведомления об ошибке. Развернуть его можно кликом на блок. Затем установите CloudStack-UI (см. `инструкции по установке интерфейса <https://github.com/bwsw/cloudstack-ui#getting-started-guide>`_). CloudStack-UI создан для более легкого и удобного управления облачной  инфраструктурой — просмотра и использования облачных ресурсов, включая виртуальные машины, шаблоны и ISO, диски и снимки, группы безопасности и адреса IP.  Информация, представленная в данном документе, поможет начать работу с CloudStack-UI. Если прежде вы не работали с CloudStack, рекомендуем начать с установки системы CloudStack. Для этого следуйте инструкциям в `официальной документации <http://docs.cloudstack.apache.org/en/4.11.1.0/installguide/index.html>`_. Для входа в систему используйте логин и пароль, предоставленные администратором: Для перехода на первый уровень меню нажмите  |menu icon|, а затем выберите нужный раздел из двух. Слева находится панель основного меню. В ней отображаются имя пользователя и названия разделов, кликом на которые можно переходить из раздела в раздел. Откройте панель *Использование Ресурсов* в верхней части экрана, где представлена информация о следующих ресурсах: Имя пользователя * -  ID пользователя в вашем аккаунте.  Виртуальные машины; Виртуальные машины; Диски и их снимки; При входе в систему, пользователь видит раздел *Виртуальные машины* в меню второго уровня. В меню первого уровня отображаются два основных раздела, в которых можно увидеть следующие вложенные элементы меню: Вы можете переключиться между используемыми и доступными ресурсами, кликнув переключатель над списком данных о ресурсах. 