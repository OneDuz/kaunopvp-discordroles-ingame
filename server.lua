local function getDiscordIdFromIdentifiers(identifiers)
    for _, identifier in pairs(identifiers) do
        if string.find(identifier, "discord:") then
            return string.gsub(identifier, "discord:", "")
        end
    end
    return nil
end

local function getHighestDiscordRole(discordId, callback)
    PerformHttpRequest('http://localhost:8900/discordRoles', function(err, text, headers)
        if err == 200 then
            local responseData = json.decode(text)
            callback(responseData.roleId, responseData.roleName)
        else
            print('Error getting highest role: ' .. err)
            callback(nil, nil)
        end
    end, 'POST', json.encode({discordId = discordId}), {["Content-Type"] = 'application/json'})
end

RegisterCommand('roles', function(source, args, rawCommand)
    if source == 0 then 
        local playerId = args[1]
        if playerId then
            local discordId = getDiscordIdFromIdentifiers(GetPlayerIdentifiers(playerId))
            if discordId then
                getHighestDiscordRole(discordId, function(roleId, roleName)
                    if roleId and roleName then
                        print('Highest role for player ' .. playerId .. ': ' .. roleName .. ' (' .. roleId .. ')')
                    else
                        print('Failed to get highest role for player ' .. playerId)
                    end
                end)
            else
                print('No Discord ID found for player ' .. playerId)
            end
        else
            print('Usage: /roles [playerId]')
        end
    else
        print('This command can only be used from the server console.')
    end
end, true)
