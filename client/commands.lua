Z.registerCommand(Config.Settings.openCommand, function()
    if (not Z.hasPermission(Config.Settings.permissions.useMenu)) then return end
    if (not MountedUI) then return Z.notify("uiNotMounted") end

    OpenMenu()
end, "Open tools to get prop alignments")

-- Temp command in case you want to clear due to the changes to the core structure
RegisterCommand("wipe_history", function()
    SetResourceKvp("zyke_propaligner:History", "[]")
end, false)

-- Debug command: Forcefully detach and delete any props still attached to the local player
RegisterCommand("resetprops", function()
    local ply = PlayerPedId()

    -- Iterate over all objects in the world and delete those attached to the player
    -- We limit the search radius to keep performance reasonable
    local handle, obj = FindFirstObject()
    local success
    repeat
        if (DoesEntityExist(obj)) then
            local attachedTo = GetEntityAttachedTo(obj)
            if (attachedTo == ply) then
                DetachEntity(obj, true, true)
                DeleteEntity(obj)
            end
        end
        success, obj = FindNextObject(handle)
    until not success
    EndFindObject(handle)

    -- Also clear any tasks in case an animation is still playing
    ClearPedTasks(ply)

    Z.notify("propsForceCleared")
end, false)