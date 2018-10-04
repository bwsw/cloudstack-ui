��    $      <              \  3   ]  F   �  U   �  �   .  P   �  {      ,   �  �   �  `   q     �     �  5   �  j  0  =   �  &   �  %      	   &     0     C     [     h  �   q     :	  y   H	     �	     �	  6   �	  �   %
  }     ;  �  (   �  �   �  9   x  �   �     �  �    3   �  F     U   Z  �   �  P   Q  {   �  ,     �   K  `   �     T     f  5   |  j  �  =     &   [  %   �  	   �     �     �     �     �  �   �     �  y   �     D     `  6   p  �   �  }   �  ;    (   G  �   p  9   �  �   4         Action box - Allows deleting a key from the system. Administrators can see and manage keys for all accounts in the domain. Besides, the keys can be grouped by accounts that may be convenient for list viewing. By clicking "Actions" |actions icon| you can expand the list of actions for those SSH keys that belong to your user only. The deleting action is available here. By clicking an SSH key in the list you will open a details sidebar to the right. By clicking “Create” |create icon| in the bottom-right corner you will open a form where you should specify a key name: Click "CANCEL" to drop adding a description. Click "Delete" to delete a key and then confirm your action in the dialogue window. The key will be deleted. Click "Cancel" to close the window without deleting a key. CloudStack-UI allows managing SSH key in a separate section which is more convenient for a user. Create an SSH Key Filtering of SSH Keys For every key the following information is displayed: In addition to the username and password authentication, CloudStack supports using SSH keys to log in to the cloud infrastructure for additional security. Find more information in the `official documentation <http://docs.cloudstack.apache.org/projects/cloudstack-administration/en/latest/virtual_machines.html?highlight=keys#using-ssh-keys-for-authentication>`_. In the *SSH keys* section you can create and manage SSH keys. It contains the following information: Key action box allowing key deleting; Key name; SSH Key Action Box SSH Key Details Sidebar SSH Key List SSH Keys SSH key description - In this block a description can be added to understand better what this key is for. Click the block and enter a short description in the text field. Then click "SAVE" to save it. SSH key name; SSH keys existing in the account are presented in this section. A user can see and manage SSH keys for his/her user only. SSH public key fingerprint; SSH public key; The created SSH key is available to assign to VMs now. The description is saved to account tags if they are supported for the account. Account tags can be switched on in the `configuration file <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md>`_ by an Administrator. The filtering tool is available to Administrators. It is placed above the list of keys and allows filtering keys by accounts. Then click “CREATE”. The SSH key will be auto-generated. The public key will appear in the list of SSH keys with a fingerprint. In the modal window, you will see the private key. This private key is not saved in the system. You should save it for yourself. Click "COPY" to correctly copy it and save it locally. Then click “OK” to close the window. You can edit the description of an SSH key by clicking |edit icon|. Change the existing description in the text field and save the edits. You can generate a new SSH key to use for authentication. You can specify an SSH public key entering its value in the field. It should start from ``ssh-rsa`` followed by one space and at least one symbol. Then click “CREATE”. The key will be saved. No private key is required in this case. You can switch the view from a list mode to a card mode using the switch tool |view icon|/|box icon| in the upper-right corner. Project-Id-Version: CSUI 
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
 Action box - Allows deleting a key from the system. Administrators can see and manage keys for all accounts in the domain. Besides, the keys can be grouped by accounts that may be convenient for list viewing. By clicking "Actions" |actions icon| you can expand the list of actions for those SSH keys that belong to your user only. The deleting action is available here. By clicking an SSH key in the list you will open a details sidebar to the right. By clicking “Create” |create icon| in the bottom-right corner you will open a form where you should specify a key name: Click "CANCEL" to drop adding a description. Click "Delete" to delete a key and then confirm your action in the dialogue window. The key will be deleted. Click "Cancel" to close the window without deleting a key. CloudStack-UI allows managing SSH key in a separate section which is more convenient for a user. Create an SSH Key Filtering of SSH Keys For every key the following information is displayed: In addition to the username and password authentication, CloudStack supports using SSH keys to log in to the cloud infrastructure for additional security. Find more information in the `official documentation <http://docs.cloudstack.apache.org/projects/cloudstack-administration/en/latest/virtual_machines.html?highlight=keys#using-ssh-keys-for-authentication>`_. In the *SSH keys* section you can create and manage SSH keys. It contains the following information: Key action box allowing key deleting; Key name; SSH Key Action Box SSH Key Details Sidebar SSH Key List SSH Keys SSH key description - In this block a description can be added to understand better what this key is for. Click the block and enter a short description in the text field. Then click "SAVE" to save it. SSH key name; SSH keys existing in the account are presented in this section. A user can see and manage SSH keys for his/her user only. SSH public key fingerprint; SSH public key; The created SSH key is available to assign to VMs now. The description is saved to account tags if they are supported for the account. Account tags can be switched on in the `configuration file <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md>`_ by an Administrator. The filtering tool is available to Administrators. It is placed above the list of keys and allows filtering keys by accounts. Then click “CREATE”. The SSH key will be auto-generated. The public key will appear in the list of SSH keys with a fingerprint. In the modal window, you will see the private key. This private key is not saved in the system. You should save it for yourself. Click "COPY" to correctly copy it and save it locally. Then click “OK” to close the window. You can edit the description of an SSH key by clicking |edit icon|. Change the existing description in the text field and save the edits. You can generate a new SSH key to use for authentication. You can specify an SSH public key entering its value in the field. It should start from ``ssh-rsa`` followed by one space and at least one symbol. Then click “CREATE”. The key will be saved. No private key is required in this case. You can switch the view from a list mode to a card mode using the switch tool |view icon|/|box icon| in the upper-right corner. 