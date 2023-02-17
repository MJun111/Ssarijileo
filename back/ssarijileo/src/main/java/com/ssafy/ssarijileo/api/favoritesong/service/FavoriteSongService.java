package com.ssafy.ssarijileo.api.favoritesong.service;

import java.util.Set;

public interface FavoriteSongService {
    void subscribe(String userId, Long songId);
    void unsubscribe(String userId, Long songId);
    Boolean hasSubscribed(String userId, Long songId);
    Set<String> getUsersFavoriteSong(String userId);
    Set<String> getKeys();
    Boolean hasKey(String userId);
    void removeAll(String userId);
    void saveFavoriteSongToDB();
    void getFavoriteSongFromDB(String userId);
}
