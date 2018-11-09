��    0      �  C         (  �   )  �   �  h   O  �   �  �   S  y  �  �   ]  V   	  3   ^	  �   �	  6   
  %   Q
     w
  �   |
  L   I     �  5   �     �     �     �  �     v   �  �    /   �       �         �     �  K   �     =     J  O  O  E   �  @   �  !   &  �   H  �   �  *   �  �   �  0   �  B   �  �   +    �  	   �     �  Y   �  U   T  �  �  Z  `  �   �  �   �  z  �  C  #     g  x  h"  r   �#  ^   T$  (  �$  �   �%  `   b&     �&  m  �&  m   :(  !   �(  j   �(     5)  #   B)  Q   f)  �   �)  �   �*  �  b+  =   /  <   S/  �  �/     =1     ]1  �   |1  #   2  
   (2  �  32  t   �4  Z   _5  6   �5  �   �5  �  �6  O   8    �8  h   �9  l   <:  �  �:    J<  !   M>     o>  �   �>  �    ?                       +   "          #                        $                      *                     &   %                   .   (       	   ,                        !       
      0             )   /                 -   '             **Show last (messages)** - allows setting a maximum amount of logs to display. You can set from 1 to any number of log records. By default, 1000 messages are shown. **Show last (minutes)** - allows viewing logs for the last set period. You can set the number of minutes from 1 (default) to 10. A user can view logs for his/her VMs only. An Administrator can see logs for all accounts in the domain. Accounts * - Allows Administrators to further select a VM in a specific account/accounts. Select an account or a number of accounts in the drop-down list. After setting filtering parameters and clicking "Show logs", a user can start following logs, in other words, start monitoring the logs online. After successful deployment you can see the *View logs* section under the *Virtual Machines* menu in UI. In this section you can view the log files for a defined period of time or in a real-time mode. To view logs you should specify an account (for Administrators), a VM for which you wish to see the logs, and a log file to view the logs from. More details are provided below. By clicking "SHOW LOGS", a user can view log files corresponding to the filtering parameters. Logs are listed in a chronological order from the earliest till the latest. By default, the list contains up to 1000 log records showing logs for the last minute. By default, the system shows logs for the last day. Click "Follow log" |follow icon| for the uploaded log files, you will see the list is automatically getting refreshed per every second. Click "Show logs" to implement the filtering settings. Click "Update" to apply the settings. Date Date * - Allows selecting logs for a specific period. Click |date icon| and in the appeared calendar choose the start and end dates to see the logs for. By default, the system shows logs for the last day. Deploy the necessary components: ElasticSearch, Filebeat, Logstash, Curator. Deployment Instructions Enable the UI extension via the ``config.json`` file. File Filtering Logs Following Logs Full instructions on the Log View plugin deployment is presented at the `plugin page <https://github.com/bwsw/cloudstack-ui/wiki/View-Logs-Plugin>`_. If too many entries are to be displayed in the list, the system loads them by parts when a user scrolls the list down. In the *Virtual Machines*-*View Logs* section a user can see VM logs. This section appears if the UI-plugin - Log View - is activated. This UI-plugin works together with the backend API plugin developed to process and view virtual machine logs which are handled by ELK and delivered by Filebeat. The version of the backend API plugin matches Apache CloudStack version that it is built for. The plugin is developed and tested only with Apache CloudStack 4.11.1 Install the backend API plugin into CloudStack. Log View Plugin Log file - Allows viewing logs by a log file available for the selected VM. Choose a log file in the drop-down list. If no log file selected, all machine logs will display in the list. Overview Searching Logs Select the following parameters in the provided order from drop-down lists: Sorting Logs Text The "Follow logs" button changes its position depending on the applied sorting mode. If the "Newest first" option is disabled the button stands in the bottom-right corner, like at the screenshot above. If "Newest first" is enabled, the button goes to the upper-right corner and the latest logs will be displayed at the top of the list. The following information for each log file is presented in the list: The logs will be displayed in accordance with the chosen period. The section is under development! The sorting tool allows viewing the newest logs first in the list. Enable the checkbox to the right and click on "Show logs" to refresh the list. Time - Allows selecting logs for a specific time period within the selected dates. By default, 00:00 is defined for the start time and 23:59 is defined for the end time. Enter start and end time you wish into the fields to set a custom time period. To enable the Log View plugin you need to: To make the *View logs* section available, first deploy the backend API plugin and then activate the Log View UI-plugin via the ``config.json`` file. See deployment instructions below. To stop following logs click on |unfollow icon|. To view logs in the list, please, set up the filtering parameters. Use the search tool to find logs by a word or a text. Enter the text in the search field above the list and click on "Show logs" to refresh the list. VM * - Allows selecting logs for a specific VM. Choose a machine you wish in the drop-down list. The list of available VMs is determined by the account(s) selected at the previous step, if you are an Administrator. If you are a user, you can see the machines belonging to your user only. View Logs View Logs List You can change filtering parameters and refresh the list of logs by clicking "SHOW LOGS". You can set up parameters of log following in the "Log View Plugin Settings" section: Project-Id-Version: CSUI
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2018-11-09 09:52+0700
PO-Revision-Date: 2018-11-09 11:09+0700
Last-Translator: 
Language: ru
Language-Team: 
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.4.0
X-Generator: Poedit 1.8.7.1
 **Максимальное количество отображаемых записей** - позволяет задать максимальное число записей для показа; допустимые значения - от 1 до бесконечности. По умолчанию, показываются 1000 записей. **Показывать за последние (минуты)** - время, за которое вы желаете видеть записи; доспустимые значения - от 1 (по умолчанию) до 10 минут. Пользователь может просматривать логи только для своих машин. Администратор может просматривать логи для машин всех аккаунтов  в домене. Аккаунты * - Позволяют Администратору в следующем шаге выбрать машину конкретного(ых) аккаунта(ов), для которой необходимо просмотреть журналы . Выберите из ниспадающего списка один или несколько аккаунтов. После определения параметров фильтрации и нажатии на "ПОКАЗАТЬ ЛОГИ" пользователь может включить просмотр записей в режиме реального времени, чтобы отслеживать записи машины. После успешного подключения плагина в UI  вы увидите раздел *Просмотр логов* в разделе *Вируальные машины* основного меню слева. В этом разделе можно просматривать записи журналов ВМ за указанный период времени или в режиме реального времени . Для просмотра журналов необходимо указать аккаунт (доступно для Администраторов), машину и журнал этой машины, записи из которого нужно просмотреть. Подробнее см. описание ниже. Кликом на "ПОКАЗАТЬ ЛОГИ" пользователь может просматривать записи из журналов в соответствии с параметрами фильтрации. Записи в списке показаны в хронологическом порядке, от самых ранних до самых поздних. По умолчанию, в списке отображаются записи за последние сутки. По умолчанию, отображаются логи за последние сутки. Нажмите "Отслеживать"  |follow icon| , список начнет обновляться автоматически  с заданной регулярностью. По умолчанию установлена частота обновления - 1 раз в 1 секунду. Нажмите "Показать логи" для вывода логов согласно параметрам фильтрации. Нажмите "Обновить" для применения заданных значений. Дата Дата - позволяет просматривать журналы за определенный период времени. Нажмите |date icon| и в появившемся календаре выберите начальную и конечную дату. По умолчанию показываются логи за последние сутки. Установить необходимые компоненты: ElasticSearch, Filebeat, Logstash, Curator. Установка плагина Подключить UI-расширение через файл конфигурации ``config.json``. Журнал Фильтрация записей Просмотр записей в режиме реального времени Полная инструкция по установке бэкенд-плагина Log View представлена на `странице описания плагина <https://github.com/bwsw/cloudstack-ui/wiki/View-Logs-Plugin>`_. Если в списке большое количество записей, они будут подгружаться частями при "прокрутке" списка вниз. В разделе *Виртуальные машины*-*Просмотр логов* пользователь может просматривать записи журналов виртуальных машин. Этот раздел доступен в меню, если включен UI-плагин Log View, который работает на основе бэкенд-плагина Log View. Это API плагин разработанный для обработки и просмотра журналов виртуальных машин. Он использует стек ELK для организации хранения журналов виртуальных машин. Экспорт журналов из виртуальной машины в хранилище организуется с помощью Filebeat. Плагин разработан и протестирован только с Apache CloudStack 4.11.1. Установить бэкенд-плагин в CloudStack. Плагин для просмотра журналов ВМ Журнал * - Позволяет просматривать записи конкретного журнала. Выберите из ниспадающего списка журнал для показа записей из него. Если не выбирать конкретный журнал, в списке будут отображены записи из всех журналов выбранной машины. Общая информация Поиск по записям Выберите из ниспадающих списков следующие параметры в указанном порядке: Сортировка записей Текст Кнопка "Отслеживать" меняет положение  в зависимости от применения режима сортировки. Если сортировка "Новые сверху" отключена, кнопка находится в правом нижнем углу, как на изображении выше. Если сортировка "Новые сверху" включена, кнопка отображается в правом нижнем углу и записи в списке будут отображаться в обратном хронологическом порядке - от более ранних к более поздним. Для каждой записи в таблице представлена следующая информация: В списке будут отражены логи за указанный период. Раздел в процессе разработки! Для сортировки записей можно активировать опцию "Новые сверху" справа и обновить список кликом на "ПОКАЗАТЬ ЛОГИ". Время - Позволяет задать конкретный промежуток времени в рамках заданного периода. По умолчанию, для начального времени установлено значение 00:00, а для конечного - 23:59. Вы можете ввести желаемое время в полях для начального и конечного времени. Чтобы подключить UI-плагин Log View, необходимо: Чтобы подключить раздел *Просмотр логов*, нужно сначала установить бэкенд-плагин Log View, а затем включить его через файл конфигурации ``config.json`` . Чтобы остановить отслеживание записей, нажмите |unfollow icon|. Для просмотра логов в списке задайте параметры фильтрации. Для быстрого поиска по списку записей воспользуйтесь строкой поиска, расположенной над списком. Введите слово или текст и нажмите "ПОКАЗАТЬ ЛОГИ", чтобы обновить список. Записи будут отфильтрованы по заданным критериям поиска. ВМ * -  Позволяют выбрать журнылы конкретной ВМ. Выберите ВМ из ниспадающего списка. Список доступных ВМ определяется аккаунтом(ами), выбранным(и) на предыдущем шаге, если вы Администратор. Если вы пользователь, в списке вы увидите те машины, которые принадлежат вашему пользователю. Просмотр логов в UI Список логов Можно изменить параметры фильтрации и обновить список логов, нажав "ПОКАЗАТЬ ЛОГИ". Вы можете изменить параметры по умолчанию в разделе настроек “Просмотр логов (режим реального времени)”: 