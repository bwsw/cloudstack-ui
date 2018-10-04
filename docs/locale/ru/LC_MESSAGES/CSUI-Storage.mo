��    r      �              <     =  ?   O  p   �  
      �        �  \   �     G	     d	     x	  G   �	  I   �	  �   '
  �   �
  +   �  L   �     �  �     L     j   d  (   �  R   �  x   K  �   �  l   I  F   �  1   �     /     A     T     i  <   q  I   �  �   �     �  4  �  V   �  �     A   �  �   �  
   r     }  �   �  a     ,   n     �  �   �  r   �     �  i     B   x  �   �     Q  f   a  /   �  9   �  �   2  �  �  �   �  A  8  5  z  �   �  N   u  C   �  y      \   �   �   �   *   �!  $   �!  �   �!  �   `"  6   �"  H   *#  �   s#     H$     Z$  0   l$     �$     �$  �   �$  G   c%  6   �%  �   �%  F   �&  \   �&  '   J'     r'     �'     �'  n   �'     (     2(     :(  �   K(  .    )  ,   /)  B   \)  r   �)  Y   *  @   l*  �   �*  *   d+  r   �+     ,     ,  9   +,     e,     x,     �,  R   -  e   ^-  �   �-  /   E.  �  u.     60  ?   H0  p   �0  
   �0  �   1     �1  \   �1     @2     ]2     q2  G   �2  I   �2  �    3  �   �3  +   4  L   �4     �4  �   x5  L   6  j   ]6  (   �6  R   �6  x   D7  �   �7  l   B8  F   �8  1   �8     (9     :9     M9     b9  <   j9  I   �9  �   �9     �:  4  �:  V   �;  �   <  A   �<  �   �<  
   k=     v=  �   �=  a   >  ,   g>     �>  �   �>  r   �?     �?  i   @  B   q@  �   �@     JA  f   ZA  /   �A  9   �A  �   +B  �  �B  �   �D  A  1E  5  sF  �   �G  N   nH  C   �H  y   I  \   {I  �   �I  *   �J  $   �J  �   �J  �   YK  6   �K  H   #L  �   lL     AM     SM  0   eM     �M     �M  �   �M  G   \N  6   �N  �   �N  F   �O  \   �O  '   CP     kP     �P     �P  n   �P     Q     +Q     3Q  �   DQ  .   �Q  ,   (R  B   UR  r   �R  Y   S  @   eS  �   �S  *   ]T  r   �T     �T     U  9   $U     ^U     qU     �U  R   V  e   WV  �   �V  /   >W   **Attach/Detach** **Create Volume** - Allows creating a volume from the snapshot. **Create a template** - Allows creating a template from the snapshot. This template can be used for VM creation. **Delete** **Delete** - Allows deleting the snapshot. Click “Delete” in the Action box and confirm your action in modal window. The snapshot will be deleted. Click “Cancel” to cancel the snapshot deleting. **Resize the disk** **Revert Volume To Snapshot** - Allows turning the volume back to the state of the snapshot. **Set up snapshot schedule** **Take a snapshot** A creation form will appear. Action on drives are available under the Actions button |actions icon|. All snapshots are saved in the list of snapshots. For a snapshot you can: An attached disk can be detached. Click "Detach" in the Actions list and confirm your action in the dialogue window. The data disk will be detached from the virtual machine. As in all lists, there is the filtering tool for selecting drives by zones and/or types. You also can apply the search tool selecting a drive by its name or a part of the name. At the right sidebar you can find two tabs: By clicking a disk in the list you can access the information on the volume. Click "+" to save the schedule. You can add more than one schedule but only one per each type (hourly, daily, weekly, monthly). Click "Attach" in the Actions list and in the dialogue window select a virtual machine to attach the disk to. Click "ATTACH" to perform the attachment. Click "CANCEL" to drop all the settings. The drive will not be created then. Click "CREATE" to save the settings and create the new volume. You will see the drive appears in the list. Click "Cancel" to drop the size changes. Click "Delete" in the Actions list and confirm your action in the dialogue window. Click "SHOW ADDITIONAL FIELDS" to expand the list of optional settings. It allows creating a template that requires HVM. Click "Save" to save the description. Description will be saved to volume `tags <https://github.com/bwsw/cloudstack-ui/wiki/Tags>`_. Click "Take a snapshot" in the disk Actions list and in the dialogue window enter the following information: Click the "Add" button |create icon| and enter in the dialogue window: Click “Cancel” to cancel the volume creation. Create New Volume Create a template; Delete the snapshot. Delete. Description * - Provide a short description of the template. Description - Add a description of the snapshot to know what it contains. Description - Allows entering a short description to the drive. Click at the Description card and enter a short description in the text block. Detach; Disk offering * - Select from the list of available offerings opening it in a modal window by clicking "SELECT". The list of available disk offerings is determined in the `configuration file <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#service-offering-availability>`_ by Administrator. Disk offering - Presents the information on the disk offering chosen at disk creation. Disks can be viewed as a list or as a grid of cards. Switch the view by clicking a view icon |view icon|/|box icon| in the upper-right corner. Domain Administrator can see disks of all accounts in the domain. Domain Administrators can see the list of drives of all accounts in the domain. Filtering by accounts is available to Administrators. Drive list Drive name, Dynamically scalable - Tick this option if the template contains XS/VM Ware tools to support the dynamic scaling of VM CPU/memory. Every snapshot is saved in a separate card. There you will see the name and time of the snapshot. Fill in the form to register a new template: Filtering of Drives For a newly taken snapshot all actions except "Delete" are disabled until the snapshot is backed up to the Secondary Storage that may take some time. Once it is backed up, a full range of actions is available to a user. For better distinguising of drives in the list you can group them by zones and/or types, like in the figure below: For data disks: For each disk offering you will see a range of parameters. The following parameters are shown by default: For each drive in the list the following information is presented: For each snapshot the list of actions is available. Find more information on snapshot actions in the :ref:`Actions_on_Snapshot_Volume` section below. For root disks: General information - Presents disk size, date and time of creation, the storage type (shared, local). Group - Select a group from the drop-down list. Here you can find a list of disks existing for your user. If a volume has snapshots the system will ask you if you want to delete them as well. Click "YES" to delete the snapshots of the volume. Click "NO" to keep them. If necessary, you can create a data disk and attach it to your VM. By clicking the "Create" button |create icon| in the bottom-right corner you will open a creation form. Please, make sure you definitely need an additional disk as it takes resources and requires expenses. If you do not have disks yet, when clicking "Create", a dialogue window will ask you if you are surely want to create a drive. Confirm your creation action by clicking "CONTINUE": If the selected disk offering has a custom disk size (it is set by Administrator), you can change the disk size moving the slider to the volume size you wish. If you have just started working with CloudStack and you do not have virtual machines yet, you have no disks in the list. Once you create a VM, a root disk is created for it automatically. Creation of an additional disk takes resources and requires expenses. Please, make sure you definitely need an additional data disk. In the *Storage* section you can create new volumes. Please, note that if you are aimed at creation of a virtual machine, we do not recommend starting from adding new disks to the system. You can go right to the *Virtual Machines* section and create a VM. A root disk will be cerated for the VM automatically. In the *Storage* section, you can create and manage drives for virtual machines. Here you can add new disks, create templates and snapshots of a volume, view the list of snapshots for each volume. In the appeared window set up a new size and click "RESIZE" to save the edits. In the appeared window set up the schedule for recurring snapshots: In the dialogue window confirm your action. Please, note, the virtual machine the volume is assigned to will be rebooted. Likewise the Virtual Machine information tab, the same actions are available for a snapshot: More parameters can be added via the `configuration file <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#disk-offering-parameters>`_ by an Administrator. Name * - Enter a name of the new template. Name * - Enter a name of the volume. Name - Define a name for the snapshot. It is auto-generated in the format ``<date>-<time>``. But you can specify any name you wish. Name of the snapshot * - Define a name for the snapshot. It is autogenerated in the form ``<date>-<time>``. But you can specify any name you wish. OS type * - Select an OS type from the drop-down list. Once all fields are filled in click "Create" to create the new template. Password enabled - Tick this option if the template has the password change script installed. That means the VM created on the base of this template will be accessed by a password, and this password can be reset. Read rate (IO/s); Read rate (MB/s); Required fields are marked with an asterisk (*). Resize the disk. Resize the disk; Root disks are visually distinguished from data disks in the list. There is an option to display only spare disks which allows saving user's time in certain cases. See the :ref:`Actions_on_Snapshot_Volume` section for more information. Select a disk offering in the list and click "SELECT". Select a minute (for hourly scheduling), the time (for daily scheduling), the day of week (for weekly scheduling) or the day of month (for monthly scheduling) when the snapshotting is to be done; Select the frequency of snapshotting - hourly, daily, weekly, monthly; Select the timezone according to which the snapshotting is to be done at the specified time; Set the number of snapshots to be made. Set up snapshot schedule; Size, Snapshots Action Box Snapshots tab - Allows creating disk snapshots. Snapshots can be taken for disks with the "Ready" status only. State - Ready or Allocated. Storage Take a snapshot; The Actions button |actions icon| is available to the right. It expands the list of actions for a disk. See the information on actions in the :ref:`Actions_on_Disks` section below. The data disk will be deleted from the system. The following actions are available on disk: Then click "Create" and see the snapshot has appeared in the list. This action can be applied to data disks. It allows attaching/detaching the data disk to/from the virtual machine. This action can be applied to data disks. It allows deleting a data disk from the system. This action is available for disks with the "Ready" status only. This action is available to data disks created on the base of disk offerings with a custom disk size. Disk offerings with custom disk size can be created by Root Administrators only. To create a new volume fill in the fields: Type a name for a new volume into the Name field in the modal window. Click “Create” to register a new volume. Volume Action Box Volume Details Sidebar Volume tab - Provides the information on the disk volume: Write rate (IO/s). Write rate (MB/s); You can change the disk size by selecting "Resize the disk" option in the Actions list. You are able to enlarge disk size only. You can edit the description by clicking the "Edit" button |edit icon| in the tab. You can schedule the regular snapshotting by clicking "Set up snapshot schedule" in the Actions list. You can take a snapshot of the disk to preserve the data volumes. Snapshots can be taken for disks with the "Ready" status only. Zone * - Select a zone from the drop-down list. Project-Id-Version: CSUI 
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2018-10-02 10:36+0700
PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE
Last-Translator: FULL NAME <EMAIL@ADDRESS>
Language: ru
Language-Team: ru <LL@li.org>
Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.4.0
 **Attach/Detach** **Create Volume** - Allows creating a volume from the snapshot. **Create a template** - Allows creating a template from the snapshot. This template can be used for VM creation. **Delete** **Delete** - Allows deleting the snapshot. Click “Delete” in the Action box and confirm your action in modal window. The snapshot will be deleted. Click “Cancel” to cancel the snapshot deleting. **Resize the disk** **Revert Volume To Snapshot** - Allows turning the volume back to the state of the snapshot. **Set up snapshot schedule** **Take a snapshot** A creation form will appear. Action on drives are available under the Actions button |actions icon|. All snapshots are saved in the list of snapshots. For a snapshot you can: An attached disk can be detached. Click "Detach" in the Actions list and confirm your action in the dialogue window. The data disk will be detached from the virtual machine. As in all lists, there is the filtering tool for selecting drives by zones and/or types. You also can apply the search tool selecting a drive by its name or a part of the name. At the right sidebar you can find two tabs: By clicking a disk in the list you can access the information on the volume. Click "+" to save the schedule. You can add more than one schedule but only one per each type (hourly, daily, weekly, monthly). Click "Attach" in the Actions list and in the dialogue window select a virtual machine to attach the disk to. Click "ATTACH" to perform the attachment. Click "CANCEL" to drop all the settings. The drive will not be created then. Click "CREATE" to save the settings and create the new volume. You will see the drive appears in the list. Click "Cancel" to drop the size changes. Click "Delete" in the Actions list and confirm your action in the dialogue window. Click "SHOW ADDITIONAL FIELDS" to expand the list of optional settings. It allows creating a template that requires HVM. Click "Save" to save the description. Description will be saved to volume `tags <https://github.com/bwsw/cloudstack-ui/wiki/Tags>`_. Click "Take a snapshot" in the disk Actions list and in the dialogue window enter the following information: Click the "Add" button |create icon| and enter in the dialogue window: Click “Cancel” to cancel the volume creation. Create New Volume Create a template; Delete the snapshot. Delete. Description * - Provide a short description of the template. Description - Add a description of the snapshot to know what it contains. Description - Allows entering a short description to the drive. Click at the Description card and enter a short description in the text block. Detach; Disk offering * - Select from the list of available offerings opening it in a modal window by clicking "SELECT". The list of available disk offerings is determined in the `configuration file <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#service-offering-availability>`_ by Administrator. Disk offering - Presents the information on the disk offering chosen at disk creation. Disks can be viewed as a list or as a grid of cards. Switch the view by clicking a view icon |view icon|/|box icon| in the upper-right corner. Domain Administrator can see disks of all accounts in the domain. Domain Administrators can see the list of drives of all accounts in the domain. Filtering by accounts is available to Administrators. Drive list Drive name, Dynamically scalable - Tick this option if the template contains XS/VM Ware tools to support the dynamic scaling of VM CPU/memory. Every snapshot is saved in a separate card. There you will see the name and time of the snapshot. Fill in the form to register a new template: Filtering of Drives For a newly taken snapshot all actions except "Delete" are disabled until the snapshot is backed up to the Secondary Storage that may take some time. Once it is backed up, a full range of actions is available to a user. For better distinguising of drives in the list you can group them by zones and/or types, like in the figure below: For data disks: For each disk offering you will see a range of parameters. The following parameters are shown by default: For each drive in the list the following information is presented: For each snapshot the list of actions is available. Find more information on snapshot actions in the :ref:`Actions_on_Snapshot_Volume` section below. For root disks: General information - Presents disk size, date and time of creation, the storage type (shared, local). Group - Select a group from the drop-down list. Here you can find a list of disks existing for your user. If a volume has snapshots the system will ask you if you want to delete them as well. Click "YES" to delete the snapshots of the volume. Click "NO" to keep them. If necessary, you can create a data disk and attach it to your VM. By clicking the "Create" button |create icon| in the bottom-right corner you will open a creation form. Please, make sure you definitely need an additional disk as it takes resources and requires expenses. If you do not have disks yet, when clicking "Create", a dialogue window will ask you if you are surely want to create a drive. Confirm your creation action by clicking "CONTINUE": If the selected disk offering has a custom disk size (it is set by Administrator), you can change the disk size moving the slider to the volume size you wish. If you have just started working with CloudStack and you do not have virtual machines yet, you have no disks in the list. Once you create a VM, a root disk is created for it automatically. Creation of an additional disk takes resources and requires expenses. Please, make sure you definitely need an additional data disk. In the *Storage* section you can create new volumes. Please, note that if you are aimed at creation of a virtual machine, we do not recommend starting from adding new disks to the system. You can go right to the *Virtual Machines* section and create a VM. A root disk will be cerated for the VM automatically. In the *Storage* section, you can create and manage drives for virtual machines. Here you can add new disks, create templates and snapshots of a volume, view the list of snapshots for each volume. In the appeared window set up a new size and click "RESIZE" to save the edits. In the appeared window set up the schedule for recurring snapshots: In the dialogue window confirm your action. Please, note, the virtual machine the volume is assigned to will be rebooted. Likewise the Virtual Machine information tab, the same actions are available for a snapshot: More parameters can be added via the `configuration file <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#disk-offering-parameters>`_ by an Administrator. Name * - Enter a name of the new template. Name * - Enter a name of the volume. Name - Define a name for the snapshot. It is auto-generated in the format ``<date>-<time>``. But you can specify any name you wish. Name of the snapshot * - Define a name for the snapshot. It is autogenerated in the form ``<date>-<time>``. But you can specify any name you wish. OS type * - Select an OS type from the drop-down list. Once all fields are filled in click "Create" to create the new template. Password enabled - Tick this option if the template has the password change script installed. That means the VM created on the base of this template will be accessed by a password, and this password can be reset. Read rate (IO/s); Read rate (MB/s); Required fields are marked with an asterisk (*). Resize the disk. Resize the disk; Root disks are visually distinguished from data disks in the list. There is an option to display only spare disks which allows saving user's time in certain cases. See the :ref:`Actions_on_Snapshot_Volume` section for more information. Select a disk offering in the list and click "SELECT". Select a minute (for hourly scheduling), the time (for daily scheduling), the day of week (for weekly scheduling) or the day of month (for monthly scheduling) when the snapshotting is to be done; Select the frequency of snapshotting - hourly, daily, weekly, monthly; Select the timezone according to which the snapshotting is to be done at the specified time; Set the number of snapshots to be made. Set up snapshot schedule; Size, Snapshots Action Box Snapshots tab - Allows creating disk snapshots. Snapshots can be taken for disks with the "Ready" status only. State - Ready or Allocated. Storage Take a snapshot; The Actions button |actions icon| is available to the right. It expands the list of actions for a disk. See the information on actions in the :ref:`Actions_on_Disks` section below. The data disk will be deleted from the system. The following actions are available on disk: Then click "Create" and see the snapshot has appeared in the list. This action can be applied to data disks. It allows attaching/detaching the data disk to/from the virtual machine. This action can be applied to data disks. It allows deleting a data disk from the system. This action is available for disks with the "Ready" status only. This action is available to data disks created on the base of disk offerings with a custom disk size. Disk offerings with custom disk size can be created by Root Administrators only. To create a new volume fill in the fields: Type a name for a new volume into the Name field in the modal window. Click “Create” to register a new volume. Volume Action Box Volume Details Sidebar Volume tab - Provides the information on the disk volume: Write rate (IO/s). Write rate (MB/s); You can change the disk size by selecting "Resize the disk" option in the Actions list. You are able to enlarge disk size only. You can edit the description by clicking the "Edit" button |edit icon| in the tab. You can schedule the regular snapshotting by clicking "Set up snapshot schedule" in the Actions list. You can take a snapshot of the disk to preserve the data volumes. Snapshots can be taken for disks with the "Ready" status only. Zone * - Select a zone from the drop-down list. 