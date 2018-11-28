��    O      �  k         �     �     �  
   �     �       �   "  u        �  �   �  ,   �	  -   �	  /   �	  g   
  +   z
  �   �
     B     S     b     }     �  <   �  2   �  ~        �     �  3   �  P   �  T   ?  �   �  E   �  /   �  w     *   }     �  6   �  H   �  G   >  B   �  �   �  0   �     �     �  �        �     �  :   �  	          �   !  �   �  B   D  9   �  �   �  v   B  0   �  <   �  7   '    _  �   b  K     8   T  n   �  {  �  :   x  ;   �  +   �  4        P  1   i  *   �  !   �  |   �     e  0     ~   �  o   /     �     �  �  �     �     �     �  /   �  +      b  8   �   �!  C   k"  �  �"  I   U$  [   �$  _   �$  �   [%  S   &  �  p&     �'     (  5   1(  5   g(     �(  V   �(  \   )  '  b)     �*  #   �*  e   �*  �   1+  �   �+    Z,  t   p.  X   �.  �   >/  Q   70     �0  X   �0  �   1  Y   �1  �   �1  �  �2  N   4  ?   U4  ;   �4    �4  1   �5  6   6  L   =6     �6  (   �6  �   �6  �   �7  m   �8  X   9  .  ^9  �   �:  {   T;  f   �;  a   7<    �<    �>  �   �?  U   Z@  �   �@  i  sA  o   �C  ~   MD  T   �D  \   !E  1   ~E  [   �E  Q   F  J   ^F  4  �F  ]   �G  _   <H  �   �H  �   gI  4   bJ     �J         M       E      0   F       /       D       >   2          4   7           ,   1       	       #                 "   3       +   B      $                  5                
                       J       !   <   N   .            L       H   &                       9       :   (       I          8   O   =       ?         '      C   *         K   %       ;   A   -         )       6   G   @    **Create Template** **Create Volume** **Delete** **Revert VM to Snapshot** **Revert Volume to Snapshot** A Volume snapshot is a capture of virtual machine disks. You can find more information on volume snapshots in the Apache CloudStack `documentation <http://docs.cloudstack.apache.org/en/4.11.1.0/adminguide/storage.html#working-with-volume-snapshots>`_. A details sidebar presents the information on a snapshot. It appears to the right by clicking a snapshot in the list. Actions button |actions icon|. All snapshots existing in the system are presented in the list format. There are two lists in the section - Volume snapshots and Virtual Machine snapshots. To move between lists use the switch button at the top. Below you will find details for each action. Click "CANCEL" to cancel the volume creation. Click "Cancel" to cancel the template creation. Click "Delete" in the Action box and confirm your action in modal window. The snapshot will be deleted. Click "NO" to cancel the snapshot deleting. Click “Show additional fields” to expand the list of optional settings. It allows creating a template that requires HVM. Tick this option in this case. Create template; Create volume; Date and time of creation. Date and time of creation; Delete. Description * - Provide a short description of the template. Description for the snapshot provided at creation; Dynamically scalable - Tick this option if the template contains XS/VM Ware tools to support dynamic scaling of VM CPU/memory. Fill in the fields: Filtering of Snapshots Filtering of snapshots is available above the list. For a VM snapshot the following information is presented in the details sidebar: For a Volume snapshot the following information is presented in the details sidebar: For a newly created snapshot the "Delete" action is available only till the snapshot is backed up to the Secondary Storage that may take some time. Once it is backed up (marked with a green state icon), a full range of actions is available to a user. For each snapshot in the list the following information is presented: Group - Select a group from the drop-down list. In the dialog window confirm your action. Please, note, the virtual machine the volume is assigned to will be rebooted. Name * - Enter a name of the new template. Name of the snapshot. OS type * - Select an OS type from the drop-down list. Once all fields are filled in click "Create" to create the new template. Open a creation form to register a new template from a Volume snapshot. Parent - Shows a parent snapshot (if any exists) of this snapshot; Password enabled - Tick this option if your template has the CloudStack password change script installed. That means the VM created on the base of this template will be accessed by a password, and this password can be reset. Required fields are marked with an asterisk (*). Revert VM to snapshot; Revert volume to snapshot; Select "Revert VM to Snapshot" from the actions list and confirm your action in the dialog window. The VM state will be reverted to the snapshot. Snapshot Actions Box Snapshot Details Sidebar Snapshot name and Actions under the |actions icon| button; Snapshots Snapshots List State bullet - green for a backed up snapshot, red for any error behavior, yellow for a snapshot being created, grey for allocated. The *Virtual Machines* -> *Snapshots* section contains the information on snapshots - Volume snapshots and Virtual Machine snapshots - existing in the system. The following actions are available for Virtual Machine snapshots: The following actions are available for Volume snapshots: The list of snapshots can be presented in the box view or in the list view. Change the view using |view icon|/|box icon| button. The name of a virtual machine the snapshot belongs to. It is a link that opens details of the VM for more information. The searching tool allows to find a snapshot by: This action allows creating a volume from a Volume snapshot. This action allows deleting a snapshot from the system. This action is available for Virtual Machine snapshots. It allows turning the VM back to the state of the snapshot. It is useful if you implemented any changes to the VM and they went wrong so this action allows quick restoring of a VM to its previous state. This action is available for Volume snapshots. It allows turning the volume back to the state of the snapshot. It is available to those snapshots that have a volume. Type - Presents the snapshot type - Hourly, Daily, Weekly, Monthly, Manual; Type - Presents the snapshot type, e.g. *DiskAndMemory*; Type a name for a new volume into the Name field in the modal window. Click "CREATE" to register a new volume. Virtual Machine snapshots allow users to preserve the VM data volumes and its CPU/memory state. Currently we support VM snapshots for the KVM hypervisor only. For more information about Virtual Machine snapshots check out the `official documentation <http://docs.cloudstack.apache.org/en/4.11.1.0/adminguide/virtual_machines.html?highlight=snapshots#virtual-machine-snapshots>`_. Virtual Machine snapshots are currently under development! Volume information and a virtual machine it is assigned to. Volume/VM name the snapshot is created for. You can filter the list by the following parameters: You can group snapshots: by Accounts (available for Administrators) and/or by Accounts (available to Administrators). by Type (for Volume snapshots) or by Type - Hourly, Daily, Weekly, Monthly, Manual depending on the schedule of snapshotting (available for Volume snapshots). by VM (for VM snapshots). by Virtual Machine (available for VM snapshots). by creation date - Select a date using a date picker to filter the list for the snapshots created within the specified period. isCurrent - Defines if the snapshot refers to the most recent snapshot compared to the current state of the VM; its name or a part of the name; snapshot description. Project-Id-Version: CSUI
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2018-11-22 12:33+0700
PO-Revision-Date: 2018-11-22 12:34+0700
Last-Translator: 
Language: ru
Language-Team: 
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.4.0
X-Generator: Poedit 1.8.7.1
 **Создат шаблон** **Создание диска** **Удалить** **Вернуть машину к снимку** **Вернуть диск к снимку** Снимок диска - это зафиксированное в моменте состояние дисков машины. Более подробно о снимках диска написано в  `документации Apache CloudStack <http://docs.cloudstack.apache.org/en/4.11.1.0/adminguide/storage.html#working-with-volume-snapshots>`_. В информационной панели отображается информация о снимке. Панель открывается справа кликном на снимок в списке.  Список действий под кнопкой |actions icon|. Все снимки, созданные в системе, представлены в виде списке. В разделе есть два подраздела - Диски и ВМ, они содержат списки снимков дисков и ВМ соответственно. Для переключения между подразделами используйте переключатель сверху. Ниже каждое действие описано подробнее. Чтобы отменить создание диска, нажмите "ОТМЕНИТЬ". Чтобы отменить создание шаблона, нажмите "ОТМЕНИТЬ". Нажмите "Удалить" в списке действия и подтвердите свое действие в появившемся окне. Снимок будет удален.   Чтобы отменить удаление снимка, нажмите "НЕТ". Нажмите «Показать дополнительные параметры», чтобы развернуть список дополнительных параметров настройки. Откроется флажок HVM. Он позволяет создать шаблон, который требует HVM. Отметьте эту опцию при необходимости. Создать шаблон; Создать диск; Дата и время создания снимка. Дата и время создания снимка; Удалить.  Описание * - дайте краткое описание для шаблона. Описание для снимка, добавленное при его создании; Динамическое масштабирование - отметьте эту опцию галочкой, если ваш шаблон содержит инструмент XS/VM Ware для поддержки динамического масштабирования CPU/памяти ВМ. Заполните поля: Фильтрация снимков Инструмент фильтрации снимков доступен вверху списка.  Для снимков виртуальных машин в информационной панели отображаются следующие данные: Для снимков дисков в информационной панели отображаются следующие данные: Для только что созданных снимков в списке действий доступно только действие "Удалить", т.к. снимок еще не скопирован во вторичное хранилище. Как только снимок будет скопирован во вторичное хранилище (что обозначено в UI зеленой иконкой статуса), для него будет доступен полный список действий. Для каждого снимка в списке представлена следующая информация: Группа - выберите группу из ниспадающего списка. В диалоговом окне подтвердите ваше действие. Обратите внимание, что виртуальная машина, к которой относится диск, будет перезагружена.  Название * - введите название нового шаблона. Название снимка. Тип ОС * - выберите тип ОС из ниспадающего списка. Как только все поля заполнены, нажмите «СОЗДАТЬ», чтобы создать новый шаблон. Откройте форму создания шаблона из снимка диска. Родительский снимок - Указывает родительский снимок (если он есть) данного снимка; Пароль включен - отметьте эту опцию галочкой, если у вашего шаблона установлен скрипт изменения пароля CloudStack. То есть, машина, созданная на основе данного шаблона, будет доступна по паролю, и пароль можно изменить. Обязательные поля отмечены "звездочкой" (*). Вернуть машину к состоянию снимка; Вернуть диск к состоянию снимка; Выберите "Вернуть ВМ к снимку" в списке действий и подтвердите свое действие в диалоговом окне. Состояние машины вернется к состоянию снимка. Список действий со снимком Информационная панель снимка Имя снимка и список действий под  |actions icon|; Снимки дисков Список снимков дисков Метка статуса - зеленая - "снимок сохранен", красная - "ошибка", желтая - "снимок создается", серая - "снимок аллоцирован". В разделе *Виртуальные машины* -> *Снимки* содержится информация о снимках дисков и снимках виртуальных машин, существующих в системе.  Для снимков виртуальных машин доступны следующие действия: Для снимков дисков доступны следующие действия: Снимки дисков могут быть представлены в формате карточек или в формате списка. Менять представление можно с помощью переключателя |view icon|/|box icon| в правом углу списка. Имя виртуальной машины, которой принадлежит снимок. Имя является активной ссылкой на панель деталей машины. С помощью инструмента поиска можно быстро найти снимок в списке по: Данное действие позволяет создать диск из снимка диска. Данное действие позволяет удалить снимок из системы. Данное действие доступно для снимков виртуальных машин. Оно позволяет вернуть машину к состоянию снимка. Действие полезно, если вы применили к машине изменения и что-то пошло не так, как планировалось. Тогда с помощью этого действия можно быстро восстановить машину до состояния снимка. Данное действие доступно для снимков дисков. С помощью него можно вернуть состояние диска к снимку. Оно доступно для тех снимков, у которых есть диск.  Тип - Отображает тип снимка - ежечасный, ежедневный, еженедельный, ежемесячный, вручную; Тип - Отображает тип снимка, например, *DiskAndMemory*; В открывшемся окне введите название диска в поле "Название". Нажмите "СОЗДАТЬ", чтобы сохранить новый диск.  Снимки виртуальных машин позволяют пользователю сохранить состояние дисков машины и ее ОЗУ/памяти. На сегодняшний день мы поддерживаем создание снимков машин для только гипервизора KVM. Более подробную информацию о снимках ВМ вы найдете в `официальной документации <http://docs.cloudstack.apache.org/en/4.11.1.0/adminguide/virtual_machines.html?highlight=snapshots#virtual-machine-snapshots>`_. Подраздел "Снимки виртуальных машин" находится в разработке! Информация о диске и виртуальной машине, к которой относится снимок.  Диск/машины, с которого/которой создан снимок. Фильтровать список можно по следующим параметрам: Снимки можно группировать: по аккаунтам (доступно для Администраторов) и/или  по аккаунтам (доступно для Администраторов). по типу (доступно для снимков дисков) или по типу - ежечасные, ежедневные, еженедельные, ежемесячные, с ручным режимом создания снимков, в зависимости от расписания создания снимков (доступно для снимков диска). по виртуальной машине (доступно для снимков машин). по виртуальным машинам (доступно для снимков машин). по дате создания - выберите дату, используя календарь, чтобы фильтровать список снимков, созданных в этот день. Текущий - Показывает, относится ли моментальный снимок к самому последнему снимку по сравнению с текущим состоянием виртуальной машины; названию или части названия; описанию снимка. 