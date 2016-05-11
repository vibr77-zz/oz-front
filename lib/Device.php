<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Device
 *
 * @author conradv
 */
class Device {
        
    private $name;
    private $nodeId;
    private $level;
    private $deviceType;
    
    function __construct($name, $nodeId, $level, $deviceType) {
        $this->name = $name;
        $this->nodeId = $nodeId;
        $this->level = $level;
        $this->deviceType = $deviceType;
    }
    
    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function getNodeId() {
        return $this->nodeId;
    }

    public function setNodeId($nodeId) {
        $this->nodeId = $nodeId;
    }

    public function getLevel() {
        return $this->level;
    }

    public function setLevel($level) {
        $this->level = $level;
    }

    public function getDeviceType() {
        return $this->deviceType;
    }

    public function setDeviceType($deviceType) {
        $this->deviceType = $deviceType;
    }



}

?>
