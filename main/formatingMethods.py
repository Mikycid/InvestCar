def int_to_roman(nb):
    res = ''
    nb = int(nb)
    if nb >= 50:
        res += 'L'
        nb -= 50
     
    while nb >= 10:
        res += 'X'
        nb -= 10
     
    if nb == 9:
        res += 'IX'
        nb -= 9
 
    if nb >= 5:
        res += 'V'
        nb -= 5
 
    if nb == 4:
        res += 'IV'
        nb -= 4
 
    while nb > 0:
        res += 'I'
        nb -= 1
 
    return res