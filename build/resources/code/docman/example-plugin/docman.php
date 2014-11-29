<?php
/**
 * @package     Koowa.Plugin
 * @subpackage  Docman
 *
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('KOOWA') or die;

class PlgKoowaDocman extends PlgKoowaAbstract
{
	/**
	 * After document is saved, look for certain keywords and do something
	 *
	 * @param KEvent $event
	 */
	public function onBeforeDocmanDocumentControllerEdit(KEvent $event)
	{
		//The result of the controller action is stored in the "result" property
		//In this case, the result is a KDatabaseRowDefault object
		$row = $event->result;

		//The row contains properties that map to the database table columns
		$description = $row->description;

		//You can now do anything you want with the data, for example look for certain keywords
		$year = $author = null;
		if(preg_match('#{year:([\s0-9]*)}#', $description, $match)){
			$year = trim($match[1]);
		}

		//Or get the author?
		if(preg_match('#{author:([\s\w]*)}#', $description, $match)){
			$author = trim($match[1]);
		}

		//Now do some custom query to store these values, perhaps store in a table using $row->id as an index?
		if($year){
			//Do something
		}

		if($author){
			//Do something
		}
	}

	/**
	 * Add events are processed the same as edit events
	 *
	 * @calls $this->onAfterDocumentControllerEdit($event);
	 * @param KEvent $event
	 */
	public function onAfterDocmanDocumentControllerAdd(KEvent $event)
	{
		$this->onAfterDocumentControllerEdit($event);
	}

	/**
	 * On delete, remove the custom values stored
	 * @param KEvent $event
	 */
	public function onAfterDocmanDocumentControllerDelete(KEvent $event)
	{
		$row = $event->result;

		//Do something to delete the stored values using $row->id as the key
	}
}